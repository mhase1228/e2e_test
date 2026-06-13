import { Page } from '@playwright/test';

export class ReserveConfirmPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * 確認ダイアログが表示されるまで待機
     */
    async waitForConfirmDialog() {
        // ダイアログまたはモーダルが表示されるのを待つ
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * プラン名を取得
     */
    async getPlanName(): Promise<string> {
        const text = await this.page.getByRole('heading').nth(1).textContent();
        return text || '';
    }

    /**
     * 宿泊日を取得
     */
    async getCheckInDate(): Promise<string> {
        // 確認画面に表示される日付要素を探す
        const dateElement = this.page.locator('[data-testid="checkin-date"], .check-in-date, dt:has-text("宿泊日") + dd');
        return await dateElement.textContent() || '';
    }

    /**
     * 宿泊数を取得
     */
    async getTerms(): Promise<string> {
        // 確認画面に表示される泊数要素を探す
        const termsElement = this.page.locator('[data-testid="terms"], .terms, dt:has-text("宿泊数") + dd');
        const text = await termsElement.textContent() || '';
        // "X泊" から数字を抽出
        const match = text.match(/(\d+)/);
        return match ? match[1] : '';
    }

    /**
     * 人数を取得
     */
    async getHeadCount(): Promise<string> {
        // 確認画面に表示される人数要素を探す
        const headcountElement = this.page.locator('[data-testid="head-count"], .head-count, dt:has-text("人数") + dd');
        const text = await headcountElement.textContent() || '';
        // "X人" から数字を抽出
        const match = text.match(/(\d+)/);
        return match ? match[1] : '';
    }

    /**
     * 氏名を取得
     */
    async getUsername(): Promise<string> {
        // 確認画面に表示される氏名要素を探す
        const usernameElement = this.page.locator('[data-testid="username"], .username, dt:has-text("氏名") + dd');
        const text = await usernameElement.textContent() || '';
        // "X様" から名前を抽出、または直接返す
        return text.replace(/様$/, '').trim();
    }

    /**
     * 確定するボタンをクリック
     */
    async clickConfirmButton() {
        await this.page.getByRole('button', { name: '確定する' }).click();
    }

    /**
     * キャンセルボタンをクリック
     */
    async clickCancelButton() {
        await this.page.getByRole('button', { name: 'キャンセル' }).click();
    }

    /**
     * 予約完了メッセージが表示されるか確認
     */
    async isCompletionMessageVisible(): Promise<boolean> {
        const message = this.page.getByText(/予約を完了しました|予約完了/);
        return await message.isVisible().catch(() => false);
    }
}
