// js/certificate.js

// ED 레벨 → CEFR 매핑
const ED_TO_CEFR = {
    'Pre-Basic': 'A1',
    'Basic 3': 'A1',
    'Basic 2': 'A2',
    'Basic 1': 'A2',
    'Intermediate 1': 'B1',
    'Intermediate 2': 'B1',
    'Intermediate 3': 'B1',
    'Advanced 1': 'B2',
    'Advanced 2': 'C1',
    'Advanced 3': 'C2'
};

// CEFR → 시험 점수 범위
const CEFR_TO_SCORES = {
    'A1': { toefl: 'N/A', toeic: '10-119', ielts: '1.0-1.5' },
    'A2': { toefl: 'N/A', toeic: '225-549', ielts: '3.0-3.5' },
    'B1': { toefl: '42-71', toeic: '550-784', ielts: '4.0-5.0' },
    'B2': { toefl: '72-94', toeic: '785-944', ielts: '5.5-6.5' },
    'C1': { toefl: '95-120', toeic: '945-990', ielts: '7.0-8.0' },
    'C2': { toefl: 'N/A', toeic: 'N/A', ielts: '8.5-9.0' }
};

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    loadCertificate();
});

// 인증서 로드 함수
function loadCertificate() {
    try {
        // 1. URL에서 인증서 데이터 가져오기
        const certificateData = getCertificateFromURL();
        
        if (certificateData) {
            // 2. 인증서 표시
            displayCertificate(certificateData);
            
            // 3. 버튼 표시
            document.getElementById('printActions').style.display = 'block';
        } else {
            // 4. 데이터가 없으면 에러 표시
            showError('Certificate data not found in URL');
        }
    } catch (error) {
        console.error('Error loading certificate:', error);
        showError('Failed to load certificate: ' + error.message);
    }
}

// URL에서 인증서 데이터 추출
function getCertificateFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // 방법 1: data 파라미터에서 JSON 직접 로드
    const certData = urlParams.get('data');
    if (certData) {
        try {
            return JSON.parse(decodeURIComponent(certData));
        } catch (e) {
            console.error('Error parsing certificate data:', e);
        }
    }
    
    // 방법 2: 개별 파라미터에서 데이터 수집
    const firstName = urlParams.get('firstName');
    const lastName = urlParams.get('lastName');
    const edLevel = urlParams.get('edLevel');
    
    if (firstName && lastName && edLevel) {
        return constructCertificateFromParams(urlParams);
    }
    
    // 방법 3: 로컬스토리지에서 최근 발급된 인증서 사용 (데모용)
    return getDemoCertificate();
}

// 파라미터로부터 인증서 객체 생성
function constructCertificateFromParams(params) {
    const certificate = {
        id: params.get('certId') || generateCertificateId(),
        student: {
            firstName: params.get('firstName') || '',
            lastName: params.get('lastName') || '',
            birthDate: params.get('birthDate') || '',
            email: params.get('email') || ''
        },
        achievement: {
            edLevel: params.get('edLevel') || '',
            completionDate: params.get('completionDate') || new Date().toISOString().split('T')[0],
            issueDate: new Date().toISOString().split('T')[0]
        }
    };
    
    // CEFR 레벨 계산
    certificate.achievement.cefrLevel = ED_TO_CEFR[certificate.achievement.edLevel] || 'N/A';
    
    // 예상 점수 계산
    certificate.estimatedScores = CEFR_TO_SCORES[certificate.achievement.cefrLevel] || {};
    
    return certificate;
}

// 데모 인증서 (URL에 데이터가 없을 때 사용)
function getDemoCertificate() {
    // 로컬스토리지 확인
    const lastCertificate = localStorage.getItem('lastIssuedCertificate');
    if (lastCertificate) {
        try {
            return JSON.parse(lastCertificate);
        } catch (e) {
            console.error('Error parsing stored certificate:', e);
        }
    }
    
    // 기본 데모 데이터
    return {
        id: 'ED-DEMO-' + Date.now().toString().slice(-6),
        student: {
            firstName: 'GILDONG',
            lastName: 'HONG',
            birthDate: '1990-01-01',
            email: 'demo@example.com'
        },
        achievement: {
            edLevel: 'Intermediate 2',
            cefrLevel: 'B1',
            completionDate: '2023-12-30',
            issueDate: '2024-01-15'
        },
        estimatedScores: CEFR_TO_SCORES['B1']
    };
}

// 인증서 ID 생성
function generateCertificateId() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `ED-${timestamp}-${random}`;
}

// 인증서 표시
function displayCertificate(certificate) {
    // 로딩 메시지 제거
    document.getElementById('loadingMessage').style.display = 'none';
    
    // 템플릿 복제
    const certificateBody = document.getElementById('certificateBody');
    
    // 본문 템플릿 추가
    const bodyTemplate = document.getElementById('certificateTemplate');
    const bodyClone = bodyTemplate.content.cloneNode(true);
    certificateBody.appendChild(bodyClone);
    
    // 푸터 템플릿 추가
    const footerTemplate = document.getElementById('footerTemplate');
    const footerClone = footerTemplate.content.cloneNode(true);
    certificateBody.appendChild(footerClone);
    
    // 데이터 채우기
    fillCertificateData(certificate);
}

// 인증서 데이터 채우기
function fillCertificateData(cert) {
    // 학생 정보
    if (cert.student) {
        const fullName = `${cert.student.lastName}, ${cert.student.firstName}`;
        setElementText('displayStudentName', fullName);
        setElementText('displayBirthDate', formatDate(cert.student.birthDate));
    }
    
    // 성취 정보
    if (cert.achievement) {
        setElementText('displayEdLevel', cert.achievement.edLevel);
        setElementText('displayCefrLevel', `${cert.achievement.cefrLevel} (${getCefrDescription(cert.achievement.cefrLevel)})`);
        setElementText('displayCompletionDate', formatDate(cert.achievement.completionDate));
        setElementText('displayIssueDate', formatDate(cert.achievement.issueDate));
    }
    
    // 인증서 ID
    if (cert.id) {
        setElementText('displayCertId', cert.id);
        setElementText('displayCertIdFooter', cert.id);
        setElementText('displayVerifyUrl', `verify.ed-english.com/${cert.id}`);
    }
    
    // 예상 점수
    if (cert.estimatedScores) {
        setElementText('displayToefl', formatScore(cert.estimatedScores.toefl, 'points'));
        setElementText('displayToeic', formatScore(cert.estimatedScores.toeic, 'points'));
        setElementText('displayIelts', formatScore(cert.estimatedScores.ielts, 'bands'));
    }
}

// 요소에 텍스트 설정
function setElementText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
    }
}

// 날짜 포맷팅
function formatDate(dateString) {
    if (!dateString || dateString === 'N/A') return 'N/A';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (e) {
        return 'N/A';
    }
}

// 점수 포맷팅
function formatScore(score, unit) {
    if (!score || score === 'N/A') return 'N/A';
    return `${score} ${unit}`;
}

// CEFR 레벨 설명
function getCefrDescription(cefrLevel) {
    const descriptions = {
        'A1': 'Beginner',
        'A2': 'Elementary',
        'B1': 'Intermediate',
        'B2': 'Upper Intermediate',
        'C1': 'Advanced',
        'C2': 'Proficient'
    };
    return descriptions[cefrLevel] || '';
}

// 에러 표시
function showError(message) {
    const certificateBody = document.getElementById('certificateBody');
    certificateBody.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Certificate Error</h3>
            <p>${message}</p>
            <button class="btn back-btn" onclick="window.location.href='index.html'" style="margin-top: 20px;">
                <i class="fas fa-arrow-left"></i> Back to Home
            </button>
        </div>
    `;
}

// PDF 다운로드
function downloadPDF() {
    alert('PDF download feature will be implemented in the next version.\nFor now, please use the Print function (Ctrl+P) to save as PDF.');
    
    // 향후 구현:
    // 1. jsPDF 라이브러리 추가
    // 2. HTML을 캔버스로 변환
    // 3. PDF 생성 및 다운로드
}

// 페이지 URL 복사
function copyCertificateUrl() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert('Certificate URL copied to clipboard!');
    });
}

// QR 코드 생성 (향후 구현)
function generateQRCode(text, elementId) {
    // 향후 QR 코드 라이브러리 추가 시 구현
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<small>${text}</small>`;
    }
}
