
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
    // 고객 정보 전송
    static async submitCustomerInfo(customerData) {
        try {
            const response = await fetch(`${API_BASE_URL}/customers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(customerData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('고객 정보 전송 실패:', error);
            throw error;
        }
    }

    // 임시 저장 (각 단계별 저장)
    static async saveStepData(stepData) {
        try {
            const response = await fetch(`${API_BASE_URL}/customers/temp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(stepData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('임시 저장 실패:', error);
            throw error;
        }
    }

    // 음성 데이터 전송 (선택사항)
    static async submitSpeechData(speechData) {
        try {
            const response = await fetch(`${API_BASE_URL}/speech`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    transcript: speechData.transcript,
                    timestamp: new Date().toISOString(),
                    step: speechData.step,
                    field: speechData.field
                })
            });

            return await response.json();
        } catch (error) {
            console.error('음성 데이터 전송 실패:', error);
            throw error;
        }
    }
}

export default ApiService;

