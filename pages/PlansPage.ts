import { Page, expect } from '@playwright/test';

export class PlansPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * プラン一覧ページを開く
     */
    async goto() {
        await this.page.goto('/ja/plans.html');
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * 指定されたプランの「このプランで予約」リンクをクリック
     */
    async clickReserveLink(planName: string) {
        await this.page.getByRole('link', { name: 'このプランで予約' })
            .filter({ has: this.page.getByRole('heading', { name: planName }) })
            .click();
    }

    /**
     * 最初のプランの「このプランで予約」リンクをクリック（新規ウィンドウで開く）
     */
    async clickFirstReserveLink() {
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.page.getByRole('link', { name: 'このプランで予約' }).first().click(),
        ]);
        await newPage.waitForLoadState();
        return newPage;
    }

    /**
     * 指定されたプランが表示されるまで待機
     */
    async waitForPlanVisible(planName: string) {
        await expect(this.page.getByRole('heading', { name: planName })).toBeVisible();
    }

    /**
     * 複数のプランが表示されるまで待機（Ajax非同期読み込み対応）
     */
    async waitForAllPlansLoaded() {
        // 基本プランはすぐに表示、その他のプランは非同期で読み込まれる
        await this.waitForPlanVisible('お得な特典付きプラン');
        await this.waitForPlanVisible('素泊まり');
    }

    /**
     * 指定されたプランが表示されているか確認
     */
    async isPlanVisible(planName: string): Promise<boolean> {
        const heading = this.page.getByRole('heading', { name: planName });
        return await heading.isVisible();
    }

    /**
     * 全表示プランを取得
     */
    async getAllPlans(): Promise<string[]> {
        const headings = this.page.locator('h5');
        return await headings.allTextContents();
    }
}
