import { useState, FormEvent } from 'react';
import { register } from '../api/auth';
import type { FormError } from '../types/uiTypes'; // LoginForm에서 쓰는 것과 같은 에러 타입

export default function useRegisterForm() {
    // 사용자가 화면에 입력할 4가지 빈칸의 초기 상태를 만들어요.
    const [form, setForm] = useState({ email: '', displayName: '', password: '', confirmPassword: '' });
    
    // 입력 칸에 문제가 생겼을 때 (예: 비밀번호 틀림) 보여줄 에러 글씨들을 저장해요.
    const [errors, setErrors] = useState<FormError>({});
    
    // 가입이 잘 됐는지, 실패했는지 화면 밑에 띄워줄 안내 메시지예요.
    const [status, setStatus] = useState<string | null>(null);
    
    // 지금 서버랑 통신 중인지 확인하는 값이에요. (버튼 여러 번 누르는 거 방지)
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 사용자가 키보드를 칠 때마다 그 글자를 form 상태에 바로바로 저장해 주는 역할이에요.
    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    // '회원가입' 버튼을 딱 눌렀을 때 실행되는 메인 함수예요.
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        // 폼을 제출할 때 웹페이지가 새로고침되어 버리는 원래 성질을 막아줘요.
        event.preventDefault();
        
        // 이전 메시지를 지우고, 에러를 담을 빈 바구니를 준비해요.
        setStatus(null);
        const nextErrors: FormError = {};

        // 1. 이메일 칸이 비어있으면 에러 바구니에 메시지를 담아요.
        if (!form.email.trim()) nextErrors.email = '이메일을 입력하세요.';
        
        // 2. 닉네임 칸이 비어있으면 에러 바구니에 담아요.
        if (!form.displayName.trim()) nextErrors.displayName = '닉네임을 입력하세요.';
        
        // 3. 비밀번호 칸이 비어있으면 담아요.
        if (!form.password.trim()) nextErrors.password = '비밀번호를 입력하세요.';
        
        // 4. 위에 쓴 비밀번호랑, 확인용 비밀번호가 다르면 에러 바구니에 담아요.
        if (form.password !== form.confirmPassword) {
            nextErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
        }

        // 바구니에 담긴 에러들을 실제 화면에 적용해요.
        setErrors(nextErrors);
        
        // 에러가 하나라도 있으면, 서버로 정보를 안 보내고 여기서 함수를 끝내요.
        if (Object.keys(nextErrors).length > 0) return;

        // 에러가 없으면 서버와 통신을 시작하니까 상태를 '진행 중'으로 바꿔요.
        setIsSubmitting(true);
        
        try {
            // auth.ts에 있는 register 함수에 3가지 정보를 담아서 서버로 택배를 보내요.
            const response = await register({
                email: form.email,
                password: form.password,
                displayName: form.displayName
            });
            // 택배가 잘 도착하고 응답이 오면 성공 메시지를 띄워요.
            setStatus(response.message ?? '회원가입에 성공했습니다.');
        } catch (error) {
            // 통신 중에 문제가 생기면 실패 메시지를 띄워요.
            setStatus('회원가입에 실패했습니다. 다시 시도해주세요.');
        } finally {
            // 통신이 끝나면 (성공이든 실패든) 다시 버튼을 누를 수 있게 상태를 되돌려요.
            setIsSubmitting(false);
        }
    };

    // UI 컴포넌트(화면)에서 이 기능들을 쓸 수 있게 밖으로 내보내 줘요.
    return {
        form, errors, status, isSubmitting, handleChange, handleSubmit
    };
}