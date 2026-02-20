import { CSSProperties } from 'react';
import type { SocialProvider } from './LoginForm'; // 기존 파일에서 타입 가져오기
import useRegisterForm from '../hooks/useRegisterForm'; // 방금 새로 만든 기능(훅)을 가져와요.

type Props = {
    socialProviders: SocialProvider[];
    onNavigateLogin: () => void;
};

export default function RegisterPanel({ socialProviders, onNavigateLogin }: Props) {
    // 훅에서 만들어둔 데이터와 함수들을 꺼내서 화면에 연결할 준비를 해요.
    const {
        form, errors, status, isSubmitting, handleChange, handleSubmit
    } = useRegisterForm();

    return (
        <div className="stack" role="tabpanel" aria-labelledby="회원가입">
            
            {/* 폼 안에서 엔터를 치거나 버튼을 누르면 handleSubmit 함수가 실행되게 연결해요. */}
            <form className="form" onSubmit={handleSubmit} noValidate>
                
                <label className="field">
                    <span className="field__label">이메일</span>
                    {/* 이메일을 치는 칸이에요. */}
                    <input
                        type="email"
                        placeholder="이메일 주소"
                        value={form.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        aria-invalid={Boolean(errors.email)}
                        autoComplete="off"
                    />
                    {/* 에러가 발생하면 빨간색 경고 글씨를 보여줘요. */}
                    {errors.email && <span className="field__error">{errors.email}</span>}
                </label>

                <label className="field">
                    <span className="field__label">아이디</span>
                    {/* 닉네임을 치는 칸이에요. */}
                    <input
                        type="text"
                        placeholder="사용할 이름"
                        value={form.displayName}
                        onChange={(e) => handleChange('displayName', e.target.value)}
                        aria-invalid={Boolean(errors.displayName)}
                        autoComplete="off"
                    />
                    {errors.displayName && <span className="field__error">{errors.displayName}</span>}
                </label>

                <label className="field">
                    <span className="field__label">비밀번호</span>
                    {/* 비밀번호 칸이에요. 남들이 못 보게 type을 password로 해요. */}
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={form.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        aria-invalid={Boolean(errors.password)}
                        autoComplete="new-password"
                    />
                    {errors.password && <span className="field__error">{errors.password}</span>}
                </label>

                <label className="field">
                    <span className="field__label">비밀번호 확인</span>
                    {/* 비밀번호를 제대로 쳤는지 한 번 더 치는 칸이에요. */}
                    <input
                        type="password"
                        placeholder="비밀번호 한 번 더 입력"
                        value={form.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        aria-invalid={Boolean(errors.confirmPassword)}
                        autoComplete="new-password"
                    />
                    {errors.confirmPassword && <span className="field__error">{errors.confirmPassword}</span>}
                </label>

                {/* 통신 중(isSubmitting이 true)일 때는 버튼을 비활성화(disabled) 해서 막아둬요. */}
                <button type="submit" className="primary-btn" disabled={isSubmitting}>
                    {isSubmitting ? '가입 처리 중...' : '회원가입'}
                </button>
            </form>

            {/* 성공/실패 메시지가 비어있지 않다면 화면에 띄워줘요. */}
            {status && <p className="status">{status}</p>}

            {/* 소셜 로그인 버튼들 */}
            <div className="stack gap-sm">
                <div className="divider" role="separator" aria-hidden><span>다른 방법으로 가입</span></div>
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

            <div className="divider" role="separator" aria-hidden><span>이미 계정이 있으신가요?</span></div>
            
            {/* 로그인 화면으로 넘어가는 버튼이에요. */}
            <button type="button" className="secondary-btn" onClick={onNavigateLogin}>
                로그인하러 가기
            </button>
        </div>
    );
}