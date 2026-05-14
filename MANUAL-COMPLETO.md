# DevMobile — Manual Completo de Build
**App:** DevMobile IDE  
**Versão:** 2.8.0  
**Package:** `com.devmobile.ide`  
**Owner Expo:** `maikon12`  
**Project ID:** `57007145-e348-4887-84e6-3c20644f5ec4`

---

## SUMÁRIO

1. [Pré-requisitos](#1-pré-requisitos)
2. [Configurar variáveis de ambiente (.env)](#2-configurar-variáveis-de-ambiente)
3. [Método 1 — EAS Build (Expo) — APK na nuvem](#3-método-1--eas-build-expo)
4. [Método 2 — Capacitor — APK local no PC](#4-método-2--capacitor-apk-local)
5. [Solução de problemas comuns](#5-solução-de-problemas-comuns)
6. [Estrutura do projeto](#6-estrutura-do-projeto)
7. [Chaves de API necessárias](#7-chaves-de-api)

---

## 1. Pré-requisitos

### Para os dois métodos:
- **Node.js 20+** → https://nodejs.org
- **pnpm** → `npm install -g pnpm`
- **Git** → https://git-scm.com

### Só para Método 1 (EAS):
- Conta no **Expo** → https://expo.dev (gratuita)
- **EXPO_TOKEN** → https://expo.dev/accounts/maikon12/settings/access-tokens

### Só para Método 2 (Capacitor):
- **Android Studio** → https://developer.android.com/studio
- **JDK 17+** (vem com Android Studio)
- **Android SDK** configurado (SDK 33 ou superior)

---

## 2. Configurar variáveis de ambiente

### 2.1 Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

### 2.2 Edite o `.env` com suas chaves:

```env
# Modo do app (deixe como cloud para usar o servidor)
EXPO_PUBLIC_APP_MODE=cloud
EXPO_PUBLIC_API_STRATEGY=cloud

# Sua chave de IA favorita (pelo menos uma):
EXPO_PUBLIC_GEMINI_KEY=AIzaSy...       # Grátis: https://aistudio.google.com/apikey
EXPO_PUBLIC_GROQ_KEY=gsk_...           # Grátis: https://console.groq.com
EXPO_PUBLIC_OPENAI_KEY=sk-...          # Pago: https://platform.openai.com
EXPO_PUBLIC_ANTHROPIC_KEY=sk-ant-...   # Pago: https://console.anthropic.com

# GitHub (opcional, para push/import de projetos):
EXPO_PUBLIC_GITHUB_TOKEN=ghp_...
EXPO_PUBLIC_GITHUB_USER=seu_usuario

# EAS (só para Método 1):
EXPO_TOKEN=seu_expo_token_aqui
```

> **Dica grátis:** Use Gemini (Google) ou Groq — ambos têm plano gratuito generoso.

---

## 3. Método 1 — EAS Build (Expo)

Gera o APK na nuvem da Expo. Não precisa de Android Studio instalado.

### 3.1 Instalar dependências:
```bash
# Dentro da pasta do projeto (artifacts/mobile ou raiz se extraiu o zip):
npm install
```

### 3.2 Fazer login no Expo:
```bash
npx eas-cli login
# ou com token:
export EXPO_TOKEN=seu_token_aqui
```

### 3.3 Verificar login:
```bash
npx eas-cli whoami
# Deve mostrar: maikon12
```

### 3.4 Disparar o build (APK):
```bash
EAS_NO_VCS=1 EXPO_TOKEN=$EXPO_TOKEN npx eas-cli build \
  --platform android \
  --profile preview \
  --non-interactive \
  --no-wait
```

> `--no-wait` retorna imediatamente. Acompanhe em:
> https://expo.dev/accounts/maikon12/projects/app-ide/builds

### 3.5 Ver status do build:
```bash
npx eas-cli build:list --platform android --limit 5
```

### 3.6 Quando terminar:
- Acesse o link do build no painel Expo
- Clique em **Download** para baixar o `.apk`
- Transfira para o Android e instale (habilite "fontes desconhecidas" nas configurações)

### Perfis disponíveis no eas.json:
| Perfil | Tipo | Uso |
|--------|------|-----|
| `preview` | APK | Teste rápido, instala direto |
| `development` | APK + Dev Client | Desenvolvimento com hot-reload |
| `production` | AAB | Publicar na Play Store |

---

## 4. Método 2 — Capacitor (APK local)

Gera o APK diretamente no seu PC com Android Studio. **Não usa créditos EAS.**

### 4.1 Pré-requisito: Android Studio
1. Baixe e instale: https://developer.android.com/studio
2. Abra o Android Studio → SDK Manager → instale **Android SDK 33**
3. Configure as variáveis de ambiente:

```bash
# Linux/Mac — adicione no ~/.bashrc ou ~/.zshrc:
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/emulator

# Windows — adicione nas variáveis de sistema:
# ANDROID_HOME = C:\Users\SeuNome\AppData\Local\Android\Sdk
# PATH += %ANDROID_HOME%\platform-tools
```

### 4.2 Instalar dependências:
```bash
npm install
```

### 4.3 Instalar CLI do Capacitor:
```bash
npm install -g @capacitor/cli
```

### 4.4 Gerar o build web (Expo → HTML/JS):
```bash
npx expo export --platform web
```
> Isso cria a pasta `dist/` com o app compilado.

### 4.5 Sincronizar com Capacitor:
```bash
npx cap sync android
```
> Se a pasta `android/` não existir ainda:
> ```bash
> npx cap add android
> npx cap sync android
> ```

### 4.6 Gerar o APK pelo Android Studio:
```bash
npx cap open android
```
Isso abre o Android Studio. Dentro dele:
1. Aguarde o projeto carregar (Gradle sync)
2. Menu: **Build → Build Bundle(s)/APK(s) → Build APK(s)**
3. Quando terminar: clique em **locate** para encontrar o APK

**Localização do APK gerado:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### 4.7 Gerar APK de release (assinado):
```bash
# Dentro do Android Studio:
# Build → Generate Signed Bundle/APK → APK → preencha keystore → Release
```

### 4.8 Instalar via linha de comando (se tiver ADB):
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 5. Solução de problemas comuns

### EAS Build — "Unable to resolve module react-native"
**Causa:** metro.config.js procurava na pasta errada.
**Status:** JÁ CORRIGIDO no `metro.config.js` deste projeto.

### EAS Build — "Invalid project ID"
```bash
npx eas-cli init
# Confirme: owner=maikon12, slug=app-ide
```

### EAS Build — "Not logged in"
```bash
export EXPO_TOKEN=seu_token
npx eas-cli whoami
```

### Capacitor — "SDK location not found"
1. Crie o arquivo `android/local.properties`:
```
sdk.dir=/home/SEU_USUARIO/Android/Sdk
# Windows: sdk.dir=C\:\\Users\\SEU_USUARIO\\AppData\\Local\\Android\\Sdk
```

### Capacitor — Gradle sync falhou
```bash
cd android
./gradlew clean
cd ..
npx cap sync android
```

### App abre tela branca
- Verifique se o `dist/` foi gerado antes do `cap sync`
- Reexecute: `npx expo export --platform web && npx cap sync android`

### Erro de permissão no Android (instalar APK):
- Vá em Configurações → Segurança → **Instalar apps desconhecidos**
- Habilite para o gerenciador de arquivos ou navegador

---

## 6. Estrutura do projeto

```
artifacts/mobile/           ← Raiz do projeto mobile
├── app/                    ← Telas (Expo Router)
│   └── (tabs)/
│       ├── index.tsx       ← Tela inicial / Explorer de projetos
│       ├── editor.tsx      ← Editor de código (Monaco)
│       ├── ai.tsx          ← Chat com IA
│       ├── terminal.tsx    ← Terminal
│       ├── browser.tsx     ← Navegador embutido
│       ├── tasks.tsx       ← Gerenciador de tarefas
│       ├── plugins.tsx     ← Plugins e extensões
│       ├── pwa.tsx         ← Gerenciador de PWA
│       └── settings.tsx    ← Configurações (tokens, API etc)
├── components/             ← Componentes reutilizáveis
│   ├── APKBuilderModal.tsx ← Modal de build APK (dispara EAS)
│   ├── AIChat.tsx          ← Interface de IA
│   ├── CodeEditor.tsx      ← Editor principal
│   ├── GitHubModal.tsx     ← Push/Import GitHub
│   └── Terminal.tsx        ← Terminal embutido
├── context/
│   └── AppContext.tsx      ← Estado global (projetos, configs)
├── services/
│   ├── githubService.ts    ← Integração GitHub API
│   ├── storageService.ts   ← Persistência local (SQLite)
│   └── runtimeMode.ts      ← Detecção de ambiente
├── app.json                ← Configuração Expo
├── eas.json                ← Perfis de build EAS
├── capacitor.config.ts     ← Configuração Capacitor
├── metro.config.js         ← Config Metro (monorepo-aware)
├── .env.example            ← Modelo de variáveis de ambiente
└── package.json            ← Dependências
```

---

## 7. Chaves de API

### IA (pelo menos uma):

| Provedor | Onde obter | Custo |
|----------|-----------|-------|
| **Google Gemini** | https://aistudio.google.com/apikey | Grátis |
| **Groq** | https://console.groq.com/keys | Grátis |
| OpenAI | https://platform.openai.com/api-keys | Pago |
| Anthropic | https://console.anthropic.com/settings/keys | Pago |
| OpenRouter | https://openrouter.ai/keys | Grátis + Pago |
| xAI / Grok | https://console.x.ai | Pago |

### GitHub (opcional):
- Acesse: https://github.com/settings/tokens
- Crie um token com permissões: `repo`, `workflow`
- Cole em: `EXPO_PUBLIC_GITHUB_TOKEN`

### Expo (só EAS Build):
- Acesse: https://expo.dev/accounts/maikon12/settings/access-tokens
- Crie um token de acesso
- Cole em: `EXPO_TOKEN`

---

## Comandos rápidos (resumo)

```bash
# Instalar tudo:
npm install

# Rodar localmente (precisa do Expo Go no celular):
npx expo start

# Build APK via EAS (nuvem):
EAS_NO_VCS=1 EXPO_TOKEN=seu_token npx eas-cli build --platform android --profile preview

# Build via Capacitor (local):
npx expo export --platform web
npx cap sync android
npx cap open android   # abre Android Studio → Build APK

# Ver builds EAS:
npx eas-cli build:list --platform android --limit 5

# Verificar login EAS:
npx eas-cli whoami
```

---

**DevMobile v2.8.0** | IDE mobile completo para Android
