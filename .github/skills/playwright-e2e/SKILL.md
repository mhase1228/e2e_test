---
name: playwright-e2e
description: 'HOTEL PLANISPHERE（https://hotel-example-site.takeyaqa.dev/ja/）を対象としたPlaywright E2Eテストコードの作成・実行・デバッグを支援するスキルです。テストコードの新規作成、Page Object Modelの設計、ロケーターの調査、テストの実行確認などに使用してください。'
argument-hint: '作成したいテストの内容（例: ログイン, 会員登録, 宿泊予約）'
---

# Playwright E2E テスト作成スキル

## テスト対象サイト

**HOTEL PLANISPHERE**
- URL: `https://hotel-example-site.takeyaqa.dev/ja/`
- テスト自動化の学習用ホテル予約サイト
- データはブラウザのCookie / SessionStorage / LocalStorageに保存（サーバー側保存なし）

## ページ構成

| ページ | URL | 主な特徴 |
|--------|-----|----------|
| トップ | `/ja/index.html` | ナビゲーション起点 |
| ログイン | `/ja/login.html` | メール＋パスワード入力 |
| 会員登録 | `/ja/signup.html` | 多種類インプット・バリデーションあり |
| 宿泊プラン一覧 | `/ja/plans.html` | Ajax非同期読み込み・ログイン状態で表示が変わる |
| 宿泊予約 | `/ja/reserve.html?plan-id=X` | **新規ウィンドウ**で開く・動的金額計算 |
| 宿泊予約確認 | （予約後に遷移） | アニメーション付きダイアログ |
| マイページ | `/ja/mypage.html` | ログイン後のみ・アイコン設定・退会機能 |

## 登録済みテストユーザー

| メールアドレス | パスワード | 会員ランク |
|----------------|-----------|-----------|
| ichiro@example.com | password | プレミアム会員 |
| sakura@example.com | pass1234 | 一般会員 |
| jun@example.com | pa55w0rd! | プレミアム会員 |
| yoshiki@example.com | pass-pass | 一般会員 |

## プロジェクト構成

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
└── data/
    └── users.ts               # テストユーザー定数
```

## テスト作成手順

1. **Playwright MCPでサイト調査**
   - `mcp_playwright_browser_navigate` でページにアクセス
   - `mcp_playwright_browser_snapshot` でアクセシビリティスナップショットを取得し、ロケーターを確認

2. **Page Object クラスを作成**（`pages/` 配下）

3. **テストファイルを作成**（`tests/` 配下）

4. **テスト実行で動作確認**

## ロケーターの優先順位

```typescript
page.getByRole('button', { name: '送信' })   // 1. ロール（最優先）
page.getByLabel('メールアドレス')              // 2. ラベル
page.getByPlaceholder('例：01133335555')       // 3. プレースホルダー
page.getByText('ログイン')                    // 4. テキスト
page.getByTestId('submit')                    // 5. テストID
page.locator('#email')                        // 6. CSS（最終手段）
```

## アーキテクチャ：責務の分離

テストの保守性と再利用性を実現するため、各層の責務を明確に分離します。

### 📋 各層の責務

| 層 | 責務 | 具体例 | ❌ してはいけないこと |
|-----|------|--------|-------------------|
| **Fixtures** | テスト環境のセットアップ | `pages.ts`: Page Object の注入<br>`auth.ts`: 認証状態の管理 | テスト実行ロジック<br>ロケーター操作 |
| **Page Object** | UI操作の隠蔽と検証 | `LoginPage.login()`<br>`LoginPage.getErrorMessage()`<br>`Navigation.isLoggedInDisplayed()` | テストロジック・分岐<br>テストデータ管理 |
| **Test Code** | テストシナリオ定義 | `await loginPage.login(...)`<br>`await expect(page).toHaveURL(...)`<br>複合ステップの組み合わせ | ロケーター直接操作<br>UI詳細の実装 |

### 🔄 データフロー

```
Test Code
    ↓ ロケーター隠蔽
    ↓ メソッド呼び出し
    ↓
Page Object
    ↓ ページ操作
    ↓ Playwright API使用
    ↓
Playwright + Browser
    ↓ ページ状態取得
    ↓
Test Code
    ↓ 期待結果との比較
    ↓
Test Result
```

### ✅ 責務分離のチェックリスト

#### Page Object が「するべき」こと
- [ ] 全ロケーター（セレクタ）を内部に隠蔽している
- [ ] UI操作メソッドを提供している：`click()`, `fill()`, `select()` など
- [ ] **検証メソッド**を提供している：`isErrorVisible()`, `getErrorMessage()` など
- [ ] 複合操作メソッドを提供している：`login()`, `register()`, `submitForm()` など
- [ ] ページ固有のロジックのみを実装している（テストロジックはない）
- [ ] 明示的な型注釈がある（`Page`, `BrowserContext` など）

#### Page Object が「してはいけない」こと
- [ ] `expect()` を使用しない（検証はテストコードが行う）
- [ ] テスト条件分岐（`if`, `for` など）を実装しない
- [ ] テストユーザー情報をハードコーディングしない
- [ ] `any` 型を使用しない

#### Test Code が「するべき」こと
- [ ] Page Object メソッドを呼び出すのみ
- [ ] `expect()` で期待結果を検証する
- [ ] Step コメントでシナリオを明示する
- [ ] テストユーザー（`TEST_USERS`）を参照する

#### Test Code が「してはいけない」こと
- [ ] ロケーター（`page.getByRole()` など）を直接操作しない
- [ ] ページの内部構造に依存しない
- [ ] UI詳細の実装に触れない

#### Fixtures が「するべき」こと
- [ ] Page Object をテストに注入する（`pages.ts`）
- [ ] ログイン済みセッションを提供する（`auth.ts`）
- [ ] 認証状態を `storageState` で永続化する
- [ ] 型安全な実装（`BrowserContext` など）

#### Fixtures が「してはいけない」こと
- [ ] テスト実行ロジック
- [ ] ロケーター操作

### 🚫 よくある違反パターン

#### ❌ パターン1：Test Code がロケーターを直接操作
```typescript
// test code: login.spec.ts
test('ログイン後ナビゲーション確認', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login(email, password);
    
    // ❌ ロケーター直接操作（Page Object の責務）
    const mypageLink = page.getByRole('link', { name: 'マイページ' });
    await expect(mypageLink).toBeVisible();
});
```

**修正例：**
```typescript
// pages/Navigation.ts
export class Navigation {
    async isLoggedInNavigationDisplayed(page: Page): Promise<boolean> {
        return await page.getByRole('link', { name: 'マイページ' }).isVisible();
    }
}

// test code: login.spec.ts
test('ログイン後ナビゲーション確認', async ({ page, loginPage, navigation }) => {
    await loginPage.goto();
    await loginPage.login(email, password);
    
    // ✅ Page Object に検証を委譲
    const isLoggedIn = await navigation.isLoggedInNavigationDisplayed(page);
    expect(isLoggedIn).toBe(true);
});
```

#### ❌ パターン2：Page Object が検証ロジックを含む
```typescript
// pages/LoginPage.ts
async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLoginButton();
    
    // ❌ 検証ロジック（Test Code の責務）
    if (await this.page.getByText('ログイン失敗').isVisible()) {
        throw new Error('ログインに失敗しました');
    }
}
```

**修正例：**
```typescript
// pages/LoginPage.ts
async login(email: string, password: string) {
    // ✅ UI操作のみ
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLoginButton();
}

// test code: login.spec.ts
test('ログイン失敗時エラー表示', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login('wrong@example.com', 'password');
    
    // ✅ Test Code で検証
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('ログイン失敗');
});
```

#### ❌ パターン3：Fixture が test logic を実装
```typescript
// fixtures/auth.ts
export const premiumUserContext = test.extend({
    premiumUserContext: async ({ browser }, use) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        
        // ❌ Test logic（fixture の責務外）
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('ichiro@example.com', 'password');
        
        await use(context);
        await context.close();
    }
});
```

**修正例：**
```typescript
// fixtures/auth.ts
export const premiumUserContext = test.extend({
    premiumUserContext: async ({ browser }, use) => {
        const context = await browser.newContext();
        
        // ✅ StorageState を使用（ログイン操作を使い回す）
        await context.addInitScript(() => {
            localStorage.setItem('auth_token', 'premium_token_xxx');
            sessionStorage.setItem('user_id', '1');
        });
        
        // または事前に保存した storageState を復元
        await context.addCookies([...]);
        
        await use(context);
        await context.close();
    }
});
```

## Page Object作成時のレビュー観点

### ✅ チェックリスト

#### 1. ロケーター品質
- [ ] CSS IDではなく、`getByRole()` / `getByLabel()` を優先している
- [ ] 隣接セレクタ（`+*`, `+*+` など）を使用していない
- [ ] テスト ID (`data-testid`) がある場合は活用している
- [ ] セレクタの複雑さが最小化されている

#### 2. エラーメッセージ取得の実装
- [ ] `page.evaluate()` で `document.body.innerText` の全体スキャンをしていない
- [ ] 親要素から相対的にエラー要素を探している（またはアクセシビリティスナップショットで確認済み）
- [ ] エラー要素が存在しない場合の fallback がある
- [ ] 正規表現マッチングの場合、誤マッチの可能性を考慮している

#### 3. 型安全性
- [ ] フィクスチャで `any` 型を使用していない
- [ ] 明示的な型注釈がある（`BrowserContext`, `Page` など）
- [ ] Page Object のメソッド戻り値型が適切に定義されている

#### 4. 待機ロジックの分離
- [ ] Page Object は `expect()` と `timeout` を組み合わせて使用していない
- [ ] 状態確認メソッド（`isVisible()`, `isEnabled()` など）は即座に状態を返す
- [ ] 待機が必要な場合、Test Code で `expect()` を使用して明示的に待機する
- [ ] Page Object のメソッドは「状態確認」「データ取得」「UI操作」のみ

#### 5. 実装前の調査
- [ ] 複雑なフォーム / エラーメッセージは `mcp_playwright_browser_snapshot` で確認している
- [ ] 要素の階層構造を把握してからセレクタを決定している
- [ ] HTML の `id`, `name`, `role` 属性を確認している

#### 6. 複合操作メソッド
- [ ] `login()`, `register()`, `submit()` などの高レベルメソッドが提供されている
- [ ] 複合メソッドは個別メソッドを組み合わせている（DRY原則）
- [ ] テストコードの記述を簡潔にしている

#### 7. 特殊なシナリオ対応
- [ ] 新規ウィンドウは `Promise.all()` + `waitForEvent('page')` で対応している
- [ ] Ajax 非同期読み込みは要素の表示を待機している
- [ ] ダイアログ / モーダルのクローズ方法を実装している

### ⚠️ 実装パターン集

#### ❌ 非推奨パターン
```typescript
// CSS ID に依存
page.locator('#submit-button')

// 複雑な隣接セレクタ
page.locator('input[name="email"]').locator('+*+.invalid-feedback')

// 全体をスキャンする正規表現
page.evaluate(() => document.body.innerText.match(/\d+/))

// any 型
premiumUserContext: any
```

#### ✅ 推奨パターン
```typescript
// ロール優先
page.getByRole('button', { name: '送信' })

// ラベルから相対的に検索
const emailField = page.getByLabel('メールアドレス');
const error = emailField.locator('..').locator('[role="alert"]');

// 特定要素をターゲット
const error = page.getByText('このフィールドは必須です');

// 型安全
premiumUserContext: BrowserContext
```

#### ❌ 待機ロジックの間違った実装（Page Object 内）
```typescript
// ❌ Page Object で timeout を指定した expect()
async getLoginErrorMessage(): Promise<string> {
    const errorAlert = this.page.locator('[role="alert"]');
    // 問題：待機ロジックが Page Object に隠蔽されている
    await expect(errorAlert.first()).toBeVisible({ timeout: 3000 });
    return (await errorAlert.first().textContent()) || '';
}

// ❌ isVisible() に timeout を指定
async isErrorVisible(): Promise<boolean> {
    return await this.page.locator('.error').isVisible({ timeout: 1000 });
}

// ❌ textContent() に timeout を指定
async getErrorText(): Promise<string> {
    return await this.page.locator('.error').textContent({ timeout: 2000 }) || '';
}
```

#### ✅ 待機ロジックの正しい実装
```typescript
// pages/LoginPage.ts - シンプルに取得するだけ
async getLoginErrorMessage(): Promise<string> {
    const errorAlert = this.page.locator('[role="alert"]');
    return (await errorAlert.first().textContent()) || '';
}

// 状態確認のみ（即座に）
async isErrorVisible(): Promise<boolean> {
    return await this.page.locator('.error').isVisible().catch(() => false);
}

// tests/login.spec.ts - Test Code で明示的に待機
test('ログイン失敗時エラー表示', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login('wrong@example.com', 'password');
    
    // ✅ Test Code で待機ロジックを記述
    await expect(page.locator('[role="alert"]')).toBeVisible();
    
    // その後データ取得
    const errorMessage = await loginPage.getLoginErrorMessage();
    expect(errorMessage).toContain('ログイン失敗');
});
```

**重要：** Page Object は「何をするか」を提供し、「どのタイミングで何を待つか」は Test Code が決定します。

### 📋 実装ステップ

1. **ページのスナップショット取得**
   ```bash
   # ブラウザで実装前に以下を実行してロケーターを確認
   mcp_playwright_browser_snapshot
   ```

2. **ロケーター検証**
   - 各フォーム要素の `role`, `label`, `id` を確認
   - エラー要素の階層構造を把握

3. **Page Object 実装**
   - 優先度に従ってセレクタを決定
   - 高レベルメソッドで複合操作を実装

4. **型チェック**
   ```bash
   npx tsc --noEmit
   ```

5. **テストで検証**
   - 実装したメソッドが正しく動作するか確認

## このサイト特有の注意点

### Ajax非同期読み込み（プラン一覧）
```typescript
// プランカードが表示されるまで待機
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

### ログイン状態の使い回し
```typescript
// テスト前にストレージ状態を保存・読み込みしてログイン操作を省く
await page.context().storageState({ path: 'fixtures/premium-user.json' });
```

### ログイン状態によるプラン表示の違い
- 未ログイン → 基本プランのみ表示
- 一般会員ログイン → 一般向けプランが追加表示
- プレミアム会員ログイン → プレミアム限定プランも表示

## テスト実行コマンド

```bash
npx playwright test                          # 全テスト実行
npx playwright test --project=chromium      # Chromiumのみ
npx playwright test tests/login.spec.ts     # 特定ファイル
npx playwright test --ui                    # UIモード（推奨）
npx playwright test --debug                 # デバッグモード
npx playwright codegen https://hotel-example-site.takeyaqa.dev/ja/  # テスト自動生成
```

## playwright.config.ts の推奨設定

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'https://hotel-example-site.takeyaqa.dev',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    locale: 'ja-JP',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],
});
```

## ベストプラクティス

- `page.waitForTimeout()` は使わない（フラキーになる）
- セレクターはロールやラベルを優先し、CSSクラスに依存しない
- テストは独立させ、他のテストの結果に依存させない
- 認証が必要なテストは `storageState` で認証状態を使い回す
- 各テストファイルは1機能・1画面に対応させる

## 参考リンク

- [Playwright公式ドキュメント](https://playwright.dev/docs/intro)
- [ベストプラクティス](https://playwright.dev/docs/best-practices)
- [ロケーター](https://playwright.dev/docs/locators)
- [Page Object Model](https://playwright.dev/docs/pom)
- [認証状態の共有](https://playwright.dev/docs/auth)
