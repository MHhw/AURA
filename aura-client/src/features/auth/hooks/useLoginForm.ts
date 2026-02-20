import { useState, FormEvent, ChangeEvent } from 'react';
import { login } from '../api/auth';
import type { FormError } from '../types/uiTypes';

export default function useLoginForm() {
    const [form, setForm] = useState({ identifier: '', password: '', remember: false });
    const [errors, setErrors] = useState<FormError>({});
    const [status, setStatus] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // [New] UI 컴포넌트에서 입력을 편하게 처리하기 위해 추가한 헬퍼 함수
    // (기존에는 onChange 안에서 setForm을 직접 호출했으나, 훅으로 분리하면서 핸들러 형태가 더 깔끔함)
    const handleChange = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus(null);
        const nextErrors: FormError = {};

        if (!form.identifier.trim()) nextErrors.identifier = '아이디 또는 이메일을 입력하세요.';
        if (!form.password.trim()) {
            nextErrors.password = '비밀번호를 입력하세요.';
        }
        // else if (form.password.length < 8) {
        //     nextErrors.password = '비밀번호는 8자 이상이어야 합니다.';
        // }

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

    return {
        form, errors, status, isSubmitting, handleChange, handleSubmit
    };
}
