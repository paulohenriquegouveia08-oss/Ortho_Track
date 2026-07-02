import Link from "next/link";

const quickLinks = [
  { label: "Problema", href: "#problema" },
  { label: "Solução", href: "#solucao" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Para clínicas", href: "#para-clinicas" },
  { label: "Piloto", href: "#piloto" },
];

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">OT</span>
              </div>
              <span className="font-bold text-lg">OrthoTrack</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Monitoramento inteligente para tratamentos com alinhadores removíveis.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4 text-white/80">Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/60 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4 text-white/80">Contato</h3>
            <ul className="space-y-2.5 text-white/60 text-sm">
              <li>Londrina/PR</li>
              <li>
                <a href="mailto:contato@orthotrack.com.br" className="hover:text-white transition-colors">
                  contato@orthotrack.com.br
                </a>
              </li>
              <li>
                <a href="https://wa.me/5500000000000" className="hover:text-white transition-colors">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">
            &copy; {new Date().getFullYear()} OrthoTrack. Todos os direitos reservados.
          </p>
          <Link href="/privacidade" className="text-white/40 text-xs hover:text-white/60 transition-colors">
            Privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
}
