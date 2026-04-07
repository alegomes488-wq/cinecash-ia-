IA Developer Hub - MVP

Este repositório agora contém um pequeno MVP para um "Cérebro" de IA que encontra problemas comuns em service workers e um painel administrativo com um botão para preparar deploys.

O que foi adicionado:
- Atualização segura: `sw.js` agora usa namespaced options e trata falha em `importScripts`.
- tools/ia_scanner.js: scanner Node.js que identifica padrões arriscados e pode aplicar correções com `--fix`.
- admin/index.html: página simples que gera o comando de deploy.
- scripts/deploy.sh / scripts/deploy.ps1: helpers para realizar commits e push.

Como usar:
1. Scanner: `node tools/ia_scanner.js` ou `node tools/ia_scanner.js --fix`
2. Painel: abra `admin/index.html` no seu navegador.
3. Deploy local: `scripts/deploy.sh` ou `scripts/deploy.ps1` (inspecione antes de executar).

Próximos passos recomendados:
- Vendorizar scripts remotos e remover dependência de hosts externos.
- Integrar o scanner ao CI e adicionar testes de integração para o service worker.
