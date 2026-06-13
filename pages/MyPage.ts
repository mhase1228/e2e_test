import { Page } from '@playwright/test';

export class MyPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * マイページを開く
     */
    async goto() {
        await this.page.goto('/ja/mypage.html');
    }

    /**
     * メールアドレスを取得
     */
    async getEmail(): Promise<string> {
        // dt:has-text("メール") + ddパターン、またはdata-testid属性を使用
        const emailElement = this.page.locator('[data-testid="email"], .email, dt:has-text("メール") + dd, dt:has-text("メールアドレス") + dd');
        return await emailElement.textContent() || '';
    }

    /**
     * 氏名を取得
     */
    async getUsername(): Promise<string> {
        // dt:has-text("氏名") + ddパターン、またはdata-testid属性を使用
        const usernameElement = this.page.locator('[data-testid="username"], .username, dt:has-text("氏名") + dd');
        return await usernameElement.textContent() || '';
    }

    /**
     * 会員ランクを取得
     */
    async getMemberRank(): Promise<string> {
        // dt:has-text("ランク") + ddパターン、またはdata-testid属性を使用
        const rankElement = this.page.locator('[data-testid="rank"], .rank, dt:has-text("ランク") + dd, dt:has-text("会員ランク") + dd');
        return await rankElement.textContent() || '';
    }

    /**
     * 住所を取得
     */
    async getAddress(): Promise<string> {
        // dt:has-text("住所") + ddパターン、またはdata-testid属性を使用
        const addressElement = this.page.locator('[data-testid="address"], .address, dt:has-text("住所") + dd');
        return await addressElement.textContent() || '';
    }

    /**
     * 電話番号を取得
     */
    async getPhoneNumber(): Promise<string> {
        // dt:has-text("電話") + ddパターン、またはdata-testid属性を使用
        const phoneElement = this.page.locator('[data-testid="phone"], .phone, dt:has-text("電話") + dd, dt:has-text("電話番号") + dd');
        return await phoneElement.textContent() || '';
    }

    /**
     * 性別を取得
     */
    async getGender(): Promise<string> {
        // dt:has-text("性別") + ddパターン、またはdata-testid属性を使用
        const genderElement = this.page.locator('[data-testid="gender"], .gender, dt:has-text("性別") + dd');
        return await genderElement.textContent() || '';
    }

    /**
     * お知らせの設定を取得
     */
    async getNotificationSetting(): Promise<string> {
        // dt:has-text("お知らせ") + ddパターン、またはdata-testid属性を使用
        const notificationElement = this.page.locator('[data-testid="notification"], .notification, dt:has-text("お知らせ") + dd');
        return await notificationElement.textContent() || '';
    }

    /**
     * アイコン設定ボタンが有効か確認
     */
    async isIconSettingButtonEnabled(): Promise<boolean> {
        const button = this.page.getByRole('button', { name: 'アイコン設定' });
        return await button.isEnabled().catch(() => false);
    }

    /**
     * 退会するボタンが有効か確認
     */
    async isDeleteButtonEnabled(): Promise<boolean> {
        const button = this.page.getByRole('button', { name: '退会する' });
        return await button.isEnabled().catch(() => false);
    }

    /**
     * ログアウトボタンをクリック
     */
    async clickLogoutButton() {
        await this.page.getByRole('button', { name: 'ログアウト' }).click();
    }

    /**
     * アイコン設定ボタンをクリック
     */
    async clickIconSettingButton() {
        await this.page.getByRole('button', { name: 'アイコン設定' }).click();
    }

    /**
     * 退会するボタンをクリック
     */
    async clickDeleteButton() {
        await this.page.getByRole('button', { name: '退会する' }).click();
    }
}
