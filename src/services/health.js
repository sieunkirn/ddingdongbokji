import api from '../lib/apiClient';

export async function ping() {
    // 백엔드에 /health 같은 간단 엔드포인트가 있다고 가정
    const res = await api.get('/health');
    return res.data;
}
