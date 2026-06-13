import { Page } from '@playwright/test';

export class ReservePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * 指定されたプランの予約ページを開く
     */
    async goto(planId: number) {
        await this.page.goto(`/ja/reserve.html?plan-id=${planId}`);
    }

    /**
     * 宿泊日を入力
     */
    async fillCheckInDate(date: string) {
        await this.page.locator('#date').fill(date);
        await this.page.keyboard.press('Tab'); // Close date picker if open
    }

    /**
     * 宿泊数を入力
     */
    async fillTerms(terms: number) {
        await this.page.locator('#term').fill(String(terms));
    }

    /**
     * 人数を入力
     */
    async fillHeadCount(count: number) {
        await this.page.locator('#head-count').fill(String(count));
    }

    /**
     * 朝食バイキングをチェック
     */
    async checkBreakfast() {
        await this.page.locator('#breakfast').check();
    }

    /**
     * 朝食バイキングをチェック解除
     */
    async uncheckBreakfast() {
        await this.page.locator('#breakfast').uncheck();
    }

    /**
     * 昼からチェックインプランをチェック
     */
    async checkEarlyCheckIn() {
        await this.page.locator('#early-check-in').check();
    }

    /**
     * 昼からチェックインプランをチェック解除
     */
    async uncheckEarlyCheckIn() {
        await this.page.locator('#early-check-in').uncheck();
    }

    /**
     * お得な観光プランをチェック
     */
    async checkSightseeing() {
        await this.page.locator('#sightseeing').check();
    }

    /**
     * お得な観光プランをチェック解除
     */
    async uncheckSightseeing() {
        await this.page.locator('#sightseeing').uncheck();
    }

    /**
     * 氏名を入力
     */
    async fillUsername(name: string) {
        await this.page.getByLabel('氏名').fill(name);
    }

    /**
     * 確認のご連絡を選択
     */
    async selectContact(contact: '選択してください' | '希望しない' | 'メールでのご連絡' | '電話でのご連絡') {
        await this.page.getByLabel('確認のご連絡').selectOption(
            contact === '選択してください' ? '' :
                contact === '希望しない' ? 'no' :
                    contact === 'メールでのご連絡' ? 'email' : 'tel'
        );
    }

    /**
     * ご要望を入力
     */
    async fillComment(comment: string) {
        await this.page.getByLabel(/ご要望/).fill(comment);
    }

    /**
     * 合計金額を取得
     */
    async getTotalBill(): Promise<string> {
        return await this.page.locator('#total-bill').textContent() || '';
    }

    /**
     * 予約内容を確認するボタンをクリック
     */
    async clickConfirmButton() {
        await this.page.getByRole('button', { name: '予約内容を確認する' }).click();
    }

    /**
     * 必須項目のみで予約確認実行
     */
    async submitReservationWithRequired(checkInDate: string, userName: string) {
        await this.fillCheckInDate(checkInDate);
        await this.fillUsername(userName);
        await this.selectContact('希望しない');
        await this.clickConfirmButton();
    }

    /**
     * 全項目で予約確認実行
     */
    async submitReservationWithAll(data: {
        checkInDate: string;
        terms: number;
        headCount: number;
        breakfast: boolean;
        earlyCheckIn: boolean;
        sightseeing: boolean;
        username: string;
        contact: '希望しない' | 'メールでのご連絡' | '電話でのご連絡';
        comment: string;
    }) {
        await this.fillCheckInDate(data.checkInDate);
        await this.fillTerms(data.terms);
        await this.fillHeadCount(data.headCount);

        if (data.breakfast) await this.checkBreakfast();
        if (data.earlyCheckIn) await this.checkEarlyCheckIn();
        if (data.sightseeing) await this.checkSightseeing();

        await this.fillUsername(data.username);
        await this.selectContact(data.contact);
        await this.fillComment(data.comment);

        await this.clickConfirmButton();
    }

    /**
     * 宿泊日欄のバリデーションエラーを取得
     */
    async getCheckInDateError(): Promise<string> {
        const feedback = this.page.locator('#date').locator('..').locator('[role="alert"], .invalid-feedback, .error');
        return await feedback.textContent() || '';
    }

    /**
     * 宿泊数欄のバリデーションエラーを取得
     */
    async getTermsError(): Promise<string> {
        const feedback = this.page.locator('#term').locator('..').locator('[role="alert"], .invalid-feedback, .error');
        return await feedback.textContent() || '';
    }

    /**
     * 人数欄のバリデーションエラーを取得
     */
    async getHeadCountError(): Promise<string> {
        const feedback = this.page.locator('#head-count').locator('..').locator('[role="alert"], .invalid-feedback, .error');
        return await feedback.textContent() || '';
    }

    /**
     * 氏名欄のバリデーションエラーを取得
     */
    async getUsernameError(): Promise<string> {
        const feedback = this.page.getByLabel('氏名').locator('..').locator('[role="alert"], .invalid-feedback, .error');
        return await feedback.textContent() || '';
    }

    /**
     * 確認のご連絡欄のバリデーションエラーを取得
     */
    async getContactError(): Promise<string> {
        const feedback = this.page.getByLabel('確認のご連絡').locator('..').locator('[role="alert"], .invalid-feedback, .error');
        return await feedback.textContent() || '';
    }
}
