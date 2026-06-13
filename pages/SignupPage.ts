import { Page } from '@playwright/test';

export class SignupPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * 会員登録ページを開く
     */
    async goto() {
        await this.page.goto('/ja/signup.html');
    }

    /**
     * メールアドレスを入力
     */
    async fillEmail(email: string) {
        await this.page.getByLabel(/メールアドレス/).fill(email);
    }

    /**
     * パスワードを入力
     */
    async fillPassword(password: string) {
        await this.page.getByLabel(/^パスワード/).fill(password);
    }

    /**
     * パスワード（確認）を入力
     */
    async fillPasswordConfirm(password: string) {
        await this.page.getByLabel('パスワード（確認）').fill(password);
    }

    /**
     * 氏名を入力
     */
    async fillName(name: string) {
        await this.page.getByLabel('氏名').fill(name);
    }

    /**
     * 会員ランクを選択（'premium' or 'normal'）
     */
    async selectMemberRank(rank: 'premium' | 'normal') {
        if (rank === 'premium') {
            await this.page.getByLabel('プレミアム会員').check();
        } else {
            await this.page.getByLabel('一般会員').check();
        }
    }

    /**
     * 住所を入力
     */
    async fillAddress(address: string) {
        await this.page.getByLabel('住所').fill(address);
    }

    /**
     * 電話番号を入力
     */
    async fillPhoneNumber(phone: string) {
        await this.page.getByLabel('電話番号').fill(phone);
    }

    /**
     * 性別を選択
     */
    async selectGender(gender: string) {
        await this.page.getByLabel('性別').selectOption(gender);
    }

    /**
     * 生年月日を入力
     */
    async fillBirthday(birthday: string) {
        await this.page.getByLabel('生年月日').fill(birthday);
    }

    /**
     * お知らせを受け取るチェック
     */
    async checkNotification() {
        await this.page.getByLabel('お知らせを受け取る').check();
    }

    /**
     * お知らせを受け取らないにチェック解除
     */
    async uncheckNotification() {
        await this.page.getByLabel('お知らせを受け取る').uncheck();
    }

    /**
     * 登録ボタンをクリック
     */
    async clickRegisterButton() {
        await this.page.getByRole('button', { name: '登録' }).click();
    }

    /**
     * 必須項目のみで登録実行
     */
    async registerWithRequiredFields(email: string, password: string, name: string) {
        await this.fillEmail(email);
        await this.fillPassword(password);
        await this.fillPasswordConfirm(password);
        await this.fillName(name);
        await this.clickRegisterButton();
    }

    /**
     * 全項目で登録実行
     */
    async registerWithAllFields(data: {
        email: string;
        password: string;
        name: string;
        rank: 'premium' | 'normal';
        address: string;
        phone: string;
        gender: string;
        birthday: string;
        notification: boolean;
    }) {
        await this.fillEmail(data.email);
        await this.fillPassword(data.password);
        await this.fillPasswordConfirm(data.password);
        await this.fillName(data.name);
        await this.selectMemberRank(data.rank);
        await this.fillAddress(data.address);
        await this.fillPhoneNumber(data.phone);
        await this.selectGender(data.gender);
        await this.fillBirthday(data.birthday);
        if (data.notification) {
            await this.checkNotification();
        }
        await this.clickRegisterButton();
    }

    /**
     * メールアドレス欄のバリデーションエラーを取得
     */
    async getEmailErrorMessage(): Promise<string> {
        const errorEl = this.page.locator('input[name="email"]').locator('..').locator('[role="alert"], .invalid-feedback, .error');
        return await errorEl.textContent() || '';
    }

    /**
     * パスワード欄のバリデーションエラーを取得
     */
    async getPasswordErrorMessage(): Promise<string> {
        const errorEl = this.page.locator('input[name="password"]').locator('..').locator('[role="alert"], .invalid-feedback, .error');
        return await errorEl.textContent() || '';
    }

    /**
     * パスワード（確認）欄のバリデーションエラーを取得
     */
    async getPasswordConfirmErrorMessage(): Promise<string> {
        const errorEl = this.page.locator('input[name="password-confirm"]').locator('..').locator('[role="alert"], .invalid-feedback, .error');
        return await errorEl.textContent() || '';
    }

    /**
     * 氏名欄のバリデーションエラーを取得
     */
    async getNameErrorMessage(): Promise<string> {
        const errorEl = this.page.locator('input[name="name"]').locator('..').locator('[role="alert"], .invalid-feedback, .error');
        return await errorEl.textContent() || '';
    }

    /**
     * 電話番号欄のバリデーションエラーを取得
     */
    async getPhoneErrorMessage(): Promise<string> {
        const errorEl = this.page.locator('input[name="tel"]').locator('..').locator('[role="alert"], .invalid-feedback, .error');
        return await errorEl.textContent() || '';
    }
}
