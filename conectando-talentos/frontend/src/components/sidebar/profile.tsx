export default function Profile() {
    return (
        <div className="d-flex align-items-center gap-2 px-2">
            <img
                className="border"
                src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
                alt="logo da empresa"
                style={{
                    width: "50px",
                    borderRadius: "50%"
                }}
            />

            <div className="d-flex flex-column">
                <span className="fw-bold">Empresa</span>
                <span style={{ fontSize: "14px" }}>Painel de controle</span>
            </div>
        </div>
    )
}