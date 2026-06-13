/**
 * テスト用ユーザー定数
 */
export const TEST_USERS = {
    PREMIUM_USER: {
        email: 'ichiro@example.com',
        password: 'password',
        username: '山田一郎',
        rank: 'premium' as const,
    },
    NORMAL_USER: {
        email: 'sakura@example.com',
        password: 'pass1234',
        username: '松本さくら',
        rank: 'normal' as const,
    },
    PREMIUM_USER_2: {
        email: 'jun@example.com',
        password: 'pa55w0rd!',
        username: '林潤',
        rank: 'premium' as const,
    },
    NORMAL_USER_2: {
        email: 'yoshiki@example.com',
        password: 'pass-pass',
        username: '木村良樹',
        rank: 'normal' as const,
    },
};

/**
 * ランダムなメールアドレスを生成
 */
export function generateRandomEmail(): string {
    const randomStr = Math.random().toString(36).substring(2, 15);
    return `test${randomStr}@example.com`;
}

/**
 * テスト用データ
 */
export const TEST_DATA = {
    VALID_PASSWORD: 'password123',
    INVALID_PASSWORD: 'short',
    VALID_PHONE: '01234567890',
    INVALID_PHONE: '0123456789', // 10 digits instead of 11
    VALID_NAME: 'テスト太郎',
    VALID_ADDRESS: '東京都千代田区1-1-1',
    VALID_BIRTHDAY: '2000/01/01',
};
