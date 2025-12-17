import { useState, type FormEvent, type CSSProperties } from 'react';
import { login } from '../../../api/auth'; // API 불러오기

// App.tsx에 있던 SocialProvider 타입 정의
export type SocialProvider = {
    name: string;
    accent: string;
    label: string;
};

type FormError = {
    identifier?: string;
    password?: string;
};

type Props = {
    socialProviders: SocialProvider[];
    recoveryProviders: SocialProvider[];
    onNavigateRecover: () => void;
};

export default function LoginForm({ socialProviders, recoveryProviders, onNavigateRecover }: Props) {
    const [form, setForm] = useState({ identifier: '', password: '', remember: false });
    const [errors, setErrors] = useState<FormError>({});
    const [status, setStatus] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus(null);
        const nextErrors: FormError = {};

        if (!form.identifier.trim()) nextErrors.identifier = '아이디 또는 이메일을 입력하세요.';
        if (!form.password.trim()) {
            nextErrors.password = '비밀번호를 입력하세요.';
        } else if (form.password.length < 8) {
            nextErrors.password = '비밀번호는 8자 이상이어야 합니다.';
        }

        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        setIsSubmitting(true);
        try {
            const response = await login({ email: form.identifier, password: form.password });
            setStatus(response.message ?? '로그인에 성공했습니다.');
        } catch (error) {
            setStatus('로그인에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        onChange={(e) => setForm(prev => ({ ...prev, identifier: e.target.value }))}
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
                        onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                        aria-invalid={Boolean(errors.password)}
                    />
                    {errors.password && <span className="field__error">{errors.password}</span>}
                </label>

                <label className="checkbox">
                    <input
                        type="checkbox"
                        checked={form.remember}
                        onChange={(e) => setForm(prev => ({ ...prev, remember: e.target.checked }))}
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