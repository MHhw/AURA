type Props = {
    onNavigateLogin: () => void;
};

export default function RecoveryPanel({ onNavigateLogin }: Props) {
    return (
        <div className="stack" role="tabpanel" aria-labelledby="계정 복구">
            <div className="panel-header">
                <div>
                    <p className="eyebrow">도움이 필요하신가요?</p>
                    <p className="header__title">등록된 이메일 주소로 계정 복구 안내를 보내드립니다.</p>
                </div>
            </div>
            {/* ... 나머지 JSX 내용 ... */}
            <button type="button" className="ghost-link" onClick={onNavigateLogin}>
                로그인으로 돌아가기
            </button>
        </div>
    );
}