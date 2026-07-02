import Link from "next/link";

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <Link href="/" className="text-primary text-sm font-medium hover:underline mb-8 inline-block">
          &larr; Voltar ao site
        </Link>
        <h1 className="text-3xl font-bold text-dark mb-8">Política de Privacidade</h1>

        <div className="space-y-6 text-muted leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-semibold text-dark mb-2">Dados coletados</h2>
            <p>
              Ao preencher o formulário de interesse no piloto do OrthoTrack, coletamos os seguintes dados: nome, nome da clínica, número de WhatsApp, cidade e quantidade aproximada de pacientes com alinhadores.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-dark mb-2">Finalidade</h2>
            <p>
              Os dados são utilizados exclusivamente para contato comercial e apresentação do OrthoTrack à clínica interessada em participar do piloto.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-dark mb-2">Compartilhamento</h2>
            <p>
              Os dados não são vendidos, compartilhados com terceiros ou utilizados para finalidades diversas das descritas nesta política.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-dark mb-2">Remoção de dados</h2>
            <p>
              Você pode solicitar a remoção dos seus dados a qualquer momento, entrando em contato pelo e-mail contato@orthotrack.com.br.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-dark mb-2">Contato</h2>
            <p>
              Em caso de dúvidas sobre esta política, entre em contato pelo e-mail contato@orthotrack.com.br.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
