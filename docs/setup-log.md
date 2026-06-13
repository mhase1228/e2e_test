# プロジェクトセットアップ作業ログ

**作成日:** 2026-06-13  
**プロジェクト:** HOTEL PLANISPHERE E2Eテスト（`/Users/mhase/work/e2e_test`）

---

## チャット履歴（プロンプト）

このセットアップは以下の会話の流れで進めた。

| #   | ユーザーの質問・依頼                                                                                            | 主な回答・実施内容                                                                                                                  |
| --- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 1   | E2EテストにPlaywrightを使いたい。インストールしてほしい。                                                       | `npm init playwright@latest` を実行。Chromium / Firefox / WebKit をダウンロード。                                                   |
| 2   | skill.md（ガイドドキュメント）の案を出してほしい。                                                              | テスト構造・ロケーター優先順位・POM・実行コマンド等を含む案を提示。                                                                 |
| 3   | ベストプラクティスの根拠はどのサイトか。                                                                        | Playwright公式（best-practices / locators / pom / auth）を案内。                                                                    |
| 4   | テスト対象を `https://hotel-example-site.takeyaqa.dev/ja/` にしたい。分析してプロジェクト構成を再考してほしい。 | サイトを分析し、ページ構成・テストユーザー・特有の注意点（Ajax/新規ウィンドウ/storageState）を整理してプロジェクト構成を提案。      |
| 5   | Playwright MCPを設定してほしい。                                                                                | `.vscode/mcp.json` を作成。`command` に `npx`、`args` に `@playwright/mcp@latest` を設定。                                          |
| 6   | `"/usr/local/opt/node@22/bin/npx"` は `"npx"` で良いのでは。                                                    | 指摘通り `"npx"` に修正。                                                                                                           |
| 7   | Playwright MCP経由でサイトにアクセスできるか試してほしい。                                                      | MCP経由でトップページへのアクセス・スクリーンショット取得を確認。タイトル「HOTEL PLANISPHERE - テスト自動化練習サイト」を確認済み。 |
| 8   | skill.md の配置場所はどこがいいか。                                                                             | `.github/skills/playwright-e2e/SKILL.md` を推奨（ワークスペーススコープ・`/playwright-e2e` で呼び出し可能）。                       |
| 9   | `.github/skills/playwright-e2e/SKILL.md` として作成してほしい。                                                 | サイト情報・プロジェクト構成・注意点・コマンド集を含む SKILL.md を作成。                                                            |
| 10  | これまでのチャット内容を .md ファイルにまとめてほしい。                                                         | `docs/setup-log.md` を作成。                                                                                                        |
| 11  | プロンプトの内容も入れてほしい。                                                                                | 本セクションを追加。                                                                                                                |

---

## 1. Playwright インストール

```bash
npm init playwright@latest -- --quiet
```

以下が自動的にセットアップされた：

- `@playwright/test` のインストール
- `@types/node` のインストール
- `playwright.config.ts` の生成
- `tests/example.spec.ts` の生成
- ブラウザのダウンロード（Chromium / Firefox / WebKit）

---

## 2. テスト対象サイトの分析

**サイト名:** HOTEL PLANISPHERE  
**URL:** https://hotel-example-site.takeyaqa.dev/ja/  
**用途:** テスト自動化学習用のホテル予約サイト

### ページ構成

| ページ         | URL                          | 特徴                                       |
| -------------- | ---------------------------- | ------------------------------------------ |
| トップ         | `/ja/index.html`             | ナビゲーション起点                         |
| ログイン       | `/ja/login.html`             | メール＋パスワード                         |
| 会員登録       | `/ja/signup.html`            | 多種類インプット・バリデーションあり       |
| 宿泊プラン一覧 | `/ja/plans.html`             | Ajax非同期読み込み・ログイン状態で表示変化 |
| 宿泊予約       | `/ja/reserve.html?plan-id=X` | 新規ウィンドウで開く・動的金額計算         |
| 宿泊予約確認   | （予約後に遷移）             | アニメーション付きダイアログ               |
| マイページ     | `/ja/mypage.html`            | ログイン後のみ・アイコン設定・退会機能     |

### 登録済みテストユーザー

| メールアドレス      | パスワード | 会員ランク     |
| ------------------- | ---------- | -------------- |
| ichiro@example.com  | password   | プレミアム会員 |
| sakura@example.com  | pass1234   | 一般会員       |
| jun@example.com     | pa55w0rd!  | プレミアム会員 |
| yoshiki@example.com | pass-pass  | 一般会員       |

---

## 3. プロジェクト構成（提案）

```
e2e_test/
├── playwright.config.ts
├── tests/
│   ├── login.spec.ts          # ログイン（成功・失敗・バリデーション）
│   ├── signup.spec.ts         # 会員登録（各フィールドのバリデーション）
│   ├── plans.spec.ts          # プラン一覧（Ajax待機・ログイン状態別表示）
│   ├── reserve.spec.ts        # 宿泊予約（新規ウィンドウ・動的金額）
│   └── mypage.spec.ts         # マイページ（情報確認・アイコン・退会）
├── pages/
│   ├── LoginPage.ts
│   ├── SignupPage.ts
│   ├── PlansPage.ts
│   ├── ReservePage.ts         # 新規ウィンドウ対応
│   ├── ReserveConfirmPage.ts  # ダイアログ対応
│   └── MyPage.ts
├── fixtures/
│   ├── auth.ts                # ログイン済みセッション（storageState）
│   └── pages.ts               # Page Objectのフィクスチャ化
├── data/
│   └── users.ts               # テストユーザー定数
├── docs/
│   ├── setup-log.md           # 本ファイル
│   └── test-spec.md           # テスト仕様書
├── .github/
│   └── skills/
│       └── playwright-e2e/
│           └── SKILL.md       # Copilot Chatスキル定義
└── .vscode/
    └── mcp.json               # Playwright MCP設定
```

---

## 4. このサイト特有の注意点

### Ajax非同期読み込み（プラン一覧）
```typescript
// タイムアウトでなくビジブルチェックで待機する
await expect(page.getByRole('heading', { name: '素泊まり' })).toBeVisible();
```

### 新規ウィンドウ（宿泊予約）
```typescript
const [newPage] = await Promise.all([
  page.context().waitForEvent('page'),
  page.getByRole('link', { name: 'このプランで予約' }).first().click(),
]);
await newPage.waitForLoadState();
```

### ログイン状態の使い回し（storageState）
```typescript
// 毎テストでログイン操作をせず、保存済みセッションを使い回す
await page.context().storageState({ path: 'fixtures/premium-user.json' });
```

### ログイン状態によるプラン表示の違い
- 未ログイン → 基本プランのみ
- 一般会員 → 一般向けプランが追加
- プレミアム会員 → プレミアム限定プランも表示

---

## 5. Playwright MCP セットアップ

### 設定ファイル: `.vscode/mcp.json`

```json
{
  "servers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

Copilot Chat の **Agent モード**で自動的に Playwright MCP が起動し、以下が使えるようになる：

- `mcp_playwright_browser_navigate` — ページ遷移
- `mcp_playwright_browser_snapshot` — アクセシビリティスナップショット（ロケーター調査）
- `mcp_playwright_browser_take_screenshot` — スクリーンショット取得
- `mcp_playwright_browser_click` — クリック操作

### 動作確認

Playwright MCP経由でトップページへのアクセスを確認済み：
- URL: `https://hotel-example-site.takeyaqa.dev/ja/index.html`
- タイトル: `HOTEL PLANISPHERE - テスト自動化練習サイト`

---

## 6. Copilot Chat スキル（SKILL.md）

### 配置場所
`.github/skills/playwright-e2e/SKILL.md`

### 呼び出し方
Copilot Chatで `/playwright-e2e` と入力

### スキルの内容
- テスト対象サイトのページ構成・テストユーザー一覧
- プロジェクトのディレクトリ構成
- このサイト特有の注意点（Ajax・新規ウィンドウ・storageState）
- ロケーターの優先順位・実行コマンド・ベストプラクティス

---

## 7. ベストプラクティス（根拠）

| プラクティス                        | 参照元                                     |
| ----------------------------------- | ------------------------------------------ |
| `waitForTimeout()` を使わない       | https://playwright.dev/docs/best-practices |
| ロール・ラベルを優先するセレクター  | https://playwright.dev/docs/locators       |
| テストの独立性                      | https://playwright.dev/docs/best-practices |
| `storageState` による認証の使い回し | https://playwright.dev/docs/auth           |
| Page Object Model                   | https://playwright.dev/docs/pom            |

---

## 8. 今後の作業

- [ ] `playwright.config.ts` に `baseURL` 等を設定
- [ ] `data/users.ts` にテストユーザー定数を定義
- [ ] `pages/` 配下に各Page Objectクラスを作成
- [ ] `tests/` 配下にテストファイルを作成（ログインから開始）
- [ ] `fixtures/auth.ts` にログイン済みセッション管理を実装
