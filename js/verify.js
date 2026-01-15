// js/verify.js - 검증 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeVerifyPage();
});

// 검증 페이지 초기화
function initializeVerifyPage() {
    // 샘플 ID 버튼 이벤트
    document.querySelectorAll('.sample-id').forEach(button => {
        button.addEventListener('click', function() {
            const certId = this.textContent;
            document.getElementById('certificateId').value = certId;
            verifyCertificate();
        });
    });
    
    // 검증 버튼 이벤트
    const verifyBtn = document.getElementById('verifyBtn');
    if (verifyBtn) {
        verifyBtn.addEventListener('click', verifyCertificate);
    }
    
    // 입력창 엔터 키 이벤트
    const certIdInput = document.getElementById('certificateId');
    if (certIdInput) {
        certIdInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                verifyCertificate();
            }
        });
    }
}

// 인증서 검증
function verifyCertificate() {
    const certId = document.getElementById('certificateId')?.value.trim();
    const resultDiv = document.getElementById('verifyResult');
    
    if (!certId) {
        showVerificationResult('error', 'Please enter a Certificate ID');
        return;
    }
    
    // 로딩 표시
    showVerificationResult('loading', 'Verifying certificate...');
    
    // 검증 로직 (실제로는 서버 API 호출)
    setTimeout(() => {
        const certificate = findCertificateById(certId);
        
        if (certificate) {
            showCertificateDetails(certificate);
        } else {
            showVerificationResult('error', `Certificate "${certId}" not found`);
        }
    }, 800); // 시뮬레이션을 위한 딜레이
}

// 검증 결과 표시
function showVerificationResult(type, message) {
    const resultDiv = document.getElementById('verifyResult');
    
    if (type === 'loading') {
        resultDiv.innerHTML = `
            <div class="loading-result">
                <i class="fas fa-spinner fa-spin"></i>
                <p>${message}</p>
            </div>
        `;
        return;
    }
    
    if (type === 'error') {
        resultDiv.innerHTML = `
            <div class="error-result">
                <i class="fas fa-times-circle"></i>
                <h3>Verification Failed</h3>
                <p>${message}</p>
            </div>
        `;
        return;
    }
}

// 인증서 상세 정보 표시
function showCertificateDetails(certificate) {
    const resultDiv = document.getElementById('verifyResult');
    
    // 유효성 확인 (2년)
    const issueDate = new Date(certificate.achievement.issueDate);
    const expiryDate = new Date(issueDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 2);
    const isExpired = new Date() > expiryDate;
    const isValid = !isExpired;
    
    resultDiv.innerHTML = `
        <div class="certificate-details">
            <div class="verification-header">
                <i class="fas fa-check-circle success"></i>
                <h3>Certificate Verified</h3>
                <span class="status-badge ${isValid ? 'valid' : 'expired'}">
                    ${isValid ? 'VALID' : 'EXPIRED'}
                </span>
            </div>
            
            <div class="details-grid">
                <div class="detail-item">
                    <span class="label">Certificate ID:</span>
                    <span class="value">${certificate.id}</span>
                </div>
                
                <div class="detail-item">
                    <span class="label">Student Name:</span>
                    <span class="value">${certificate.student.lastName}, ${certificate.student.firstName}</span>
                </div>
                
                <div class="detail-item">
                    <span class="label">Date of Birth:</span>
                    <span class="value">${formatDate(certificate.student.birthDate)}</span>
                </div>
                
                <div class="detail-item">
                    <span class="label">ED Level:</span>
                    <span class="value">${certificate.achievement.edLevel}</span>
                </div>
                
                <div class="detail-item">
                    <span class="label">CEFR Level:</span>
                    <span class="value">${certificate.achievement.cefrLevel}</span>
                </div>
                
                <div class="detail-item">
                    <span class="label">Issue Date:</span>
                    <span class="value">${formatDate(certificate.achievement.issueDate)}</span>
                </div>
                
                <div class="detail-item">
                    <span class="label">Expiry Date:</span>
                    <span class="value">${formatDate(expiryDate.toISOString().split('T')[0])}</span>
                </div>
            </div>
            
            <div class="verification-actions">
                <button class="btn view-btn" onclick="viewCertificate('${certificate.id}')">
                    <i class="fas fa-eye"></i> View Certificate
                </button>
                <button class="btn copy-btn" onclick="copyToClipboard('${certificate.id}')">
                    <i class="fas fa-copy"></i> Copy ID
                </button>
            </div>
            
            <div class="verification-disclaimer">
                <i class="fas fa-info-circle"></i>
                <p>This certificate verifies English Discoveries completion and CEFR equivalence. 
                It is not an official TOEFL®, TOEIC®, or IELTS® test score.</p>
            </div>
        </div>
    `;
}

// 인증서 보기
function viewCertificate(certId) {
    const certificate = findCertificateById(certId);
    if (certificate) {
        const urlData = encodeURIComponent(JSON.stringify(certificate));
        window.open(`certificate.html?data=${urlData}`, '_blank');
    }
}

// 전역 함수 내보내기
window.verifyCertificate = verifyCertificate;
window.viewCertificate = viewCertificate;
