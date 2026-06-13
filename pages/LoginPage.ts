import { Page, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * ログインページを開く
     */
    async goto() {
        await this.page.goto('/ja/login.html');
    }

    /**
     * メールアドレスを入力
     */
    async fillEmail(email: string) {
        await this.page.getByLabel('メールアドレス').fill(email);
    }

    /**
     * パスワードを入力
     */
    async fillPassword(password: string) {
        await this.page.getByLabel('パスワード').fill(password);
    }

    /**
     * ログインボタンをクリック
     */
    async clickLoginButton() {
        await this.page.locator('#login-button').click();
    }

    /**
     * ログイン実行
     */
    async login(email: string, password: string) {
        await this.fillEmail(email);
        await this.fillPassword(password);
        await this.clickLoginButton();
    }

    /**
     * メールアドレス欄のバリデーションエラーを取得
     */
    async getEmailErrorMessage(): Promise<string> {
        return await this.page.locator('#email-message').textContent() || '';
    }

    /**
     * パスワード欄のバリデーションエラーを取得
     */
    async getPasswordErrorMessage(): Promise<string> {
        return await this.page.locator('#password-message').textContent() || '';
    }

    /**
     * メールアドレス欄のバリデーションエラーが表示されているか確認
     */
    async isEmailErrorVisible(): Promise<boolean> {
        const errorEl = this.page.locator('#email-message');
        return await errorEl.isVisible();
    }

    /**
     * パスワード欄のバリデーションエラーが表示されているか確認
     */
    async isPasswordErrorVisible(): Promise<boolean> {
        const errorEl = this.page.locator('#password-message');
        return await errorEl.isVisible();
    }

    /**
     * メールアドレス欄のバリデーションエラーが表示されるまで待機
     */
    async waitForEmailErrorVisible(): Promise<void> {
        await expect(this.page.locator('#email-message')).toBeVisible();
    }

    /**
     * パスワード欄のバリデーションエラーが表示されるまで待機
     */
    async waitForPasswordErrorVisible(): Promise<void> {
        await expect(this.page.locator('#password-message')).toBeVisible();
    }

    /**
     * ログイン失敗時のエラーメッセージを取得
     * （メールアドレスまたはパスワードが違う場合のエラー）
     */
    async getLoginErrorMessage(): Promise<string> {
        // エラーメッセージを div タグのテキストで検索
        const errorDiv = this.page.locator('div:has-text("メールアドレスまたはパスワードが違います")').first();
        return (await errorDiv.textContent()) || '';
    }

    /**
     * ログイン失敗時のエラーが表示されるまで待機
     * （メールアドレスまたはパスワード欄のエラーメッセージ表示を待機）
     */
    async waitForLoginError(): Promise<void> {
        const errorDiv = this.page.locator('div:has-text("メールアドレスまたはパスワードが違います")').first();
        await expect(errorDiv).toBeVisible();
    }

    /**
     * ログイン失敗時のエラーが表示されているか確認
     */
    async isLoginErrorVisible(): Promise<boolean> {
        const errorDiv = this.page.locator('div:has-text("メールアドレスまたはパスワードが違います")').first();
        return await errorDiv.isVisible().catch(() => false);
    }
}
