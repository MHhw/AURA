import { useState, type FormEvent, type CSSProperties } from 'react';
import type { SocialProvider } from '../types/uiTypes'; // [Refactor] 분리된 파일에서 타입 가져옴
import useLoginForm from '../hooks/useLoginForm'; // [Refactor] 로직을 담당하는 훅 가져옴

type Props = {
    socialProviders: SocialProvider[];
    recoveryProviders: SocialProvider[];
    onNavigateRecover: () => void;
};

export default function LoginForm({ socialProviders, recoveryProviders, onNavigateRecover }: Props) {
    const {
        form, errors, status, isSubmitting, handleChange, handleSubmit
    } = useLoginForm();

    return (        
        <div className="stack" role="tabpanel" aria-labelledby="로그인">

            <form className="form" onSubmit={handleSubmit} noValidate>
                {/* ... (입력 필드 코드는 그대로) ... */}
                <label className="field">
                    <span className="field__label">아이디</span>
                    <input
                        type="text"
                        placeholder="이메일 또는 아이디"
                        value={form.identifier}
                        /* [Refactor] 인라인 setForm 대신 훅에서 만든 handleChange 사용 */
                        onChange={(e) => handleChange('identifier', e.target.value)}
                        aria-invalid={Boolean(errors.identifier)}
                    />
                    {errors.identifier && <span className="field__error">{errors.identifier}</span>}
                </label>

                <label className="field">
                    <span className="field__label">비밀번호</span>
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={form.password}
                        /* [Refactor] handleChange 사용 */
                        onChange={(e) => handleChange('password', e.target.value)}
                        aria-invalid={Boolean(errors.password)}
                    />
                    {errors.password && <span className="field__error">{errors.password}</span>}
                </label>

                <label className="checkbox">
                    <input
                        type="checkbox"
                        checked={form.remember}
                        /* [Refactor] handleChange 사용 (checkbox는 e.target.checked) */
                        onChange={(e) => handleChange('remember', e.target.checked)}
                    />
                    <span>아이디 저장</span>
                </label>

                <button type="submit" className="primary-btn" disabled={isSubmitting}>
                    {isSubmitting ? '확인 중...' : '로그인'}
                </button>
            </form>

            {status && <p className="status">{status}</p>}

            {/* 소셜 로그인 버튼들 */}
            <div className="stack gap-sm">
                <div className="divider" role="separator" aria-hidden><span>다른 방법으로 로그인</span></div>
                <div className="social-row">
                    {socialProviders.map((provider) => (
                        <button
                            key={provider.name}
                            type="button"
                            className={`social-btn social-${provider.name}`}
                            style={{ '--accent': provider.accent } as CSSProperties}
                        >
                            <span className="dot" aria-hidden />
                            {provider.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 계정 복구 버튼들 */}
            <div className="divider" role="separator" aria-hidden><span>계정을 잊어버리셨나요?</span></div>
            <div className="social-row">
                {recoveryProviders.map((provider) => (
                    <button
                        key={provider.name}
                        type="button"
                        className={`social-btn social-${provider.name}`}
                        style={{ '--accent': provider.accent } as CSSProperties}
                        onClick={onNavigateRecover}
                    >
                        <span className="dot" aria-hidden />
                        {provider.label}
                    </button>
                ))}
            </div>
        </div>
    );
}