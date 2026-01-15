// js/main.js - 모든 페이지 공통 JavaScript

// ==================== 공통 유틸리티 함수 ====================

/**
 * 요소가 존재하는지 확인
 */
function elementExists(id) {
    return document.getElementById(id) !== null;
}

/**
 * 요소에 텍스트 설정
 */
function setText(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

/**
 * 요소에 HTML 설정
 */
function setHTML(id, html) {
    const element = document.getElementById(id);
    if (element) {
        element.innerHTML = html;
    }
}

/**
 * 요소 표시/숨김
 */
function toggleElement(id, show) {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = show ? 'block' : 'none';
    }
}

/**
 * 날짜 포맷팅 (YYYY-MM-DD → Month Day, Year)
 */
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
        console.error('Date formatting error:', e);
        return 'N/A';
    }
}

/**
 * 현재 날짜를 YYYY-MM-DD 형식으로 반환
 */
function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

/**
 * 문자열을 대문자로 변환 (여권 형식)
 */
function toPassportCase(text) {
    return text ? text.toUpperCase().trim() : '';
}

/**
 * 이메일 유효성 검사
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * 클립보드에 복사
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!');
        return true;
    } catch (err) {
        console.error('Copy failed:', err);
        showToast('Failed to copy', 'error');
        return false;
    }
}

/**
 * 토스트 메시지 표시
 */
function showToast(message, type = 'success') {
    // 기존 토스트 제거
    const existingToast = document.getElementById('global-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 새 토스트 생성
    const toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // 스타일 적용
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '12px 24px',
        background: type === 'error' ? '#e53e3e' : '#38a169',
        color: 'white',
        borderRadius: '8px',
        zIndex: '9999',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        animation: 'slideIn 0.3s ease'
    });
    
    document.body.appendChild(toast);
    
    // 3초 후 제거
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==================== ED 데이터 상수 ====================

// ED 레벨 → CEFR 매핑 (공식)
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

// CEFR → 시험 점수 범위 (참고용)
const CEFR_TO_SCORES = {
    'A1': { toefl: 'N/A', toeic: '10-119', ielts: '1.0-1.5' },
    'A2': { toefl: 'N/A', toeic: '225-549', ielts: '3.0-3.5' },
    'B1': { toefl: '42-71', toeic: '550-784', ielts: '4.0-5.0' },
    'B2': { toefl: '72-94', toeic: '785-944', ielts: '5.5-6.5' },
    'C1': { toefl: '95-120', toeic: '945-990', ielts: '7.0-8.0' },
    'C2': { toefl: 'N/A', toeic: 'N/A', ielts: '8.5-9.0' }
};

// ED 레벨 설명
const ED_LEVEL_DESCRIPTIONS = {
    'Pre-Basic': 'Complete beginner level',
    'Basic 3': 'Basic expressions and greetings',
    'Basic 2': 'Simple daily conversations',
    'Basic 1': 'Expanded daily expressions',
    'Intermediate 1': 'Intermediate conversations',
    'Intermediate 2': 'Practical English skills',
    'Intermediate 3': 'Social and professional communication',
    'Advanced 1': 'Advanced English entry',
    'Advanced 2': 'Professional expression skills',
    'Advanced 3': 'Native-like fluency'
};

// CEFR 레벨 설명
const CEFR_DESCRIPTIONS = {
    'A1': 'Beginner',
    'A2': 'Elementary',
    'B1': 'Intermediate',
    'B2': 'Upper Intermediate',
    'C1': 'Advanced',
    'C2': 'Proficient'
};

// ==================== 로컬스토리지 관리 ====================

const STORAGE_KEYS = {
    CERTIFICATES: 'ed_certificates',
    LAST_CERTIFICATE: 'last_issued_certificate',
    USER_PREFERENCES: 'user_preferences'
};

/**
 * 로컬스토리지에서 데이터 가져오기
 */
function getFromStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('Error reading from storage:', error);
        return defaultValue;
    }
}

/**
 * 로컬스토리지에 데이터 저장
 */
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to storage:', error);
        showToast('Failed to save data', 'error');
        return false;
    }
}

/**
 * 모든 인증서 가져오기
 */
function getAllCertificates() {
    return getFromStorage(STORAGE_KEYS.CERTIFICATES, []);
}

/**
 * 특정 ID의 인증서 찾기
 */
function findCertificateById(certId) {
    const certificates = getAllCertificates();
    return certificates.find(cert => cert.id === certId);
}

/**
 * 인증서 저장
 */
function saveCertificate(certificate) {
    const certificates = getAllCertificates();
    certificates.push(certificate);
    const success = saveToStorage(STORAGE_KEYS.CERTIFICATES, certificates);
    
    if (success) {
        // 마지막 발급 인증서도 저장
        saveToStorage(STORAGE_KEYS.LAST_CERTIFICATE, certificate);
    }
    
    return success;
}

/**
 * 마지막 발급된 인증서 가져오기
 */
function getLastCertificate() {
    return getFromStorage(STORAGE_KEYS.LAST_CERTIFICATE);
}

// ==================== 인증서 관련 함수 ====================

/**
 * 인증서 ID 생성
 */
function generateCertificateId() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `ED-${timestamp}-${random}`;
}

/**
 * ED 레벨로 CEFR 레벨 가져오기
 */
function getCEFRByEdLevel(edLevel) {
    return ED_TO_CEFR[edLevel] || 'N/A';
}

/**
 * CEFR 레벨로 점수 범위 가져오기
 */
function getScoresByCEFR(cefrLevel) {
    return CEFR_TO_SCORES[cefrLevel] || { toefl: 'N/A', toeic: 'N/A', ielts: 'N/A' };
}

/**
 * 인증서 객체 생성
 */
function createCertificate(formData) {
    const certificateId = generateCertificateId();
    const cefrLevel = getCEFRByEdLevel(formData.edLevel);
    const scores = getScoresByCEFR(cefrLevel);
    
    const certificate = {
        id: certificateId,
        student: {
            firstName: toPassportCase(formData.firstName),
            lastName: toPassportCase(formData.lastName),
            birthDate: formData.birthDate,
            email: formData.email || '',
            studentId: formData.studentId || ''
        },
        achievement: {
            edLevel: formData.edLevel,
            cefrLevel: cefrLevel,
            completionDate: formData.completionDate,
            issueDate: getTodayDate()
        },
        estimatedScores: scores,
        verificationUrl: `verify.ed-english.com/${certificateId}`,
        createdAt: new Date().toISOString()
    };
    
    return certificate;
}

/**
 * URL 친화적인 인증서 데이터 생성
 */
function createCertificateUrl(certificate) {
    // 간단한 데이터만 URL에 포함
    const urlData = {
        id: certificate.id,
        fn: certificate.student.firstName,
        ln: certificate.student.lastName,
        lvl: certificate.achievement.edLevel
    };
    
    return encodeURIComponent(JSON.stringify(urlData));
}

// ==================== 폼 유효성 검사 ====================

/**
 * 폼 데이터 수집
 */
function collectFormData() {
    const data = {};
    
    // 개인정보
    if (elementExists('firstName')) {
        data.firstName = document.getElementById('firstName').value;
    }
    if (elementExists('lastName')) {
        data.lastName = document.getElementById('lastName').value;
    }
    if (elementExists('birthDate')) {
        data.birthDate = document.getElementById('birthDate').value;
    }
    if (elementExists('email')) {
        data.email = document.getElementById('email').value;
    }
    if (elementExists('studentId')) {
        data.studentId = document.getElementById('studentId').value;
    }
    
    // ED 레벨
    if (elementExists('edLevel')) {
        data.edLevel = document.getElementById('edLevel').value;
    }
    if (elementExists('completionDate')) {
        data.completionDate = document.getElementById('completionDate').value;
    }
    
    return data;
}

/**
 * 개인정보 단계 유효성 검사
 */
function validatePersonalInfo() {
    const errors = [];
    
    const firstName = document.getElementById('firstName')?.value.trim();
    const lastName = document.getElementById('lastName')?.value.trim();
    const birthDate = document.getElementById('birthDate')?.value;
    const email = document.getElementById('email')?.value.trim();
    
    if (!firstName) errors.push('First name is required');
    if (!lastName) errors.push('Last name is required');
    if (!birthDate) errors.push('Date of birth is required');
    if (!email) {
        errors.push('Email is required');
    } else if (!isValidEmail(email)) {
        errors.push('Please enter a valid email address');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * ED 레벨 단계 유효성 검사
 */
function validateEdLevel() {
    const errors = [];
    
    const edLevel = document.getElementById('edLevel')?.value;
    const completionDate = document.getElementById('completionDate')?.value;
    
    if (!edLevel) errors.push('Please select your ED level');
    if (!completionDate) errors.push('Completion date is required');
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// ==================== UI 관련 함수 ====================

/**
 * 진행 단계 업데이트
 */
function updateProgressSteps(currentStep) {
    const steps = document.querySelectorAll('.step, .progress-step');
    
    steps.forEach((step, index) => {
        if (index + 1 === currentStep) {
            step.classList.add('active');
        } else if (index + 1 < currentStep) {
            step.classList.remove('active');
            step.classList.add('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}

/**
 * 폼 단계 전환
 */
function switchFormStep(currentStepId, nextStepId) {
    const currentStep = document.getElementById(currentStepId);
    const nextStep = document.getElementById(nextStepId);
    
    if (currentStep) currentStep.classList.remove('active');
    if (nextStep) nextStep.classList.add('active');
    
    // 진행 상태 업데이트
    const stepNumber = parseInt(nextStepId.replace('step', ''));
    updateProgressSteps(stepNumber);
}

/**
 * 모달 열기
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // 배경 스크롤 막기
    }
}

/**
 * 모달 닫기
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ==================== 초기화 함수 ====================

/**
 * 공통 초기화
 */
function initializeCommon() {
    // 현재 연도를 푸터에 표시
    const yearElements = document.querySelectorAll('.current-year');
    if (yearElements.length > 0) {
        const currentYear = new Date().getFullYear();
        yearElements.forEach(el => {
            el.textContent = currentYear;
        });
    }
    
    // 모든 모달 닫기 버튼에 이벤트 추가
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // 외부 클릭 시 모달 닫기
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
    
    // 생년월일 입력 필드 제한 설정
    const birthDateInput = document.getElementById('birthDate');
    if (birthDateInput) {
        const today = new Date();
        const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
        const maxDate = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());
        
        birthDateInput.min = minDate.toISOString().split('T')[0];
        birthDateInput.max = maxDate.toISOString().split('T')[0];
    }
    
    // 완료 날짜 입력 필드 제한 설정
    const completionDateInput = document.getElementById('completionDate');
    if (completionDateInput) {
        const today = new Date().toISOString().split('T')[0];
        completionDateInput.max = today;
        
        // 기본값을 오늘 날짜로 설정
        completionDateInput.value = today;
    }
}

/**
 * 폼 페이지 초기화
 */
function initializeFormPage() {
    // ED 레벨 선택 시 CEFR 업데이트
    const edLevelSelect = document.getElementById('edLevel');
    if (edLevelSelect) {
        edLevelSelect.addEventListener('change', function() {
            const cefrLevel = getCEFRByEdLevel(this.value);
            const cefrDisplay = document.getElementById('cefrLevelDisplay');
            if (cefrDisplay) {
                cefrDisplay.textContent = cefrLevel;
            }
        });
    }
    
    // 다음 버튼 이벤트
    document.querySelectorAll('.next-btn').forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = this.closest('.form-step');
            const nextStepId = currentStep?.getAttribute('data-next');
            if (nextStepId) {
                switchFormStep(currentStep.id, nextStepId);
            }
        });
    });
    
    // 이전 버튼 이벤트
    document.querySelectorAll('.prev-btn').forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = this.closest('.form-step');
            const prevStepId = currentStep?.getAttribute('data-prev');
            if (prevStepId) {
                switchFormStep(currentStep.id, prevStepId);
            }
        });
    });
}

// ==================== 페이지 로드 시 실행 ====================

document.addEventListener('DOMContentLoaded', function() {
    // 공통 초기화
    initializeCommon();
    
    // 페이지별 초기화
    const path = window.location.pathname;
    
    if (path.includes('index.html') || path.endsWith('/')) {
        // 메인/폼 페이지
        initializeFormPage();
    } else if (path.includes('verify.html')) {
        // 검증 페이지
        // verify.js에서 처리
    } else if (path.includes('certificate.html')) {
        // 인증서 페이지
        // certificate.js에서 처리
    }
    
    // CSS 애니메이션 추가
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .toast-success { background: #38a169; }
        .toast-error { background: #e53e3e; }
        .toast-info { background: #3182ce; }
    `;
    document.head.appendChild(style);
});

// ==================== 글로벌 함수 내보내기 ====================

// 필요 시 window 객체에 함수 추가
window.CommonUtils = {
    formatDate,
    generateCertificateId,
    getCEFRByEdLevel,
    getScoresByCEFR,
    copyToClipboard,
    showToast,
    saveCertificate,
    findCertificateById
};
