// pages/ChatbotPage.jsx
import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/chatbot.css"; // 아래 CSS 파일

/** ---------------------------
 *  Web Speech API: 안전 래퍼
 *  --------------------------- */
function makeRecognition() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    const rec = new SR();
    rec.lang = "ko-KR";
    rec.interimResults = true;
    rec.continuous = false; // 최종문장 단위로만 종료
    return rec;
}

/** ---------------------------
 *  유틸: 시각용 시간 문자열
 *  --------------------------- */
const nowTime = () => {
    const d = new Date();
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const isPM = hours >= 12;
    const hh12 = hours % 12 === 0 ? 12 : hours % 12;
    const mm = minutes.toString().padStart(2, "0");
    return `${isPM ? "오후" : "오전"} ${hh12}:${mm}`;
};

export default function ChatbotPage() {
    const navigate = useNavigate();

    // 메시지 리스트: { id, role: 'bot'|'user', text, time }
    const [messages, setMessages] = useState(() => [
        {
            id: crypto.randomUUID(),
            role: "bot",
            text:
                '안녕하세요! 복지 도우미 뚱똥이에요. 버튼을 눌러 음성으로 질문해보세요.\n예시: "신청 가능한 복지혜택 알려줘"',
            time: nowTime(),
        },
    ]);

    // 음성 인식 관련 상태
    const [stage, setStage] = useState("idle"); // idle | listening | confirm | sending
    const [partial, setPartial] = useState(""); // 듣는 중 임시 문장
    const [finalText, setFinalText] = useState(""); // 확정된 문장

    // 마이크 객체
    const recRef = useRef(null);

    // 백엔드 주소
    const API_BASE = useMemo(
        () => import.meta.env.VITE_API_BASE?.trim() || "https://silvercare-backend.onrender.com",
        []
    );

    // 최초 마운트 시 인식기 준비
    useEffect(() => {
        recRef.current = makeRecognition();
        return () => {
            try {
                recRef.current?.stop();
            } catch {}
        };
    }, []);

    /** ---------------------------
     *  음성 인식 흐름
     *  --------------------------- */
    const startListen = () => {
        if (!recRef.current) {
            alert("이 브라우저는 음성 인식을 지원하지 않습니다.");
            return;
        }
        try {
            setPartial("");
            setFinalText("");
            setStage("listening");
            recRef.current.onresult = (e) => {
                let interim = "";
                let completed = "";
                for (let i = e.resultIndex; i < e.results.length; i++) {
                    const t = e.results[i][0].transcript;
                    if (e.results[i].isFinal) completed += t;
                    else interim += t;
                }
                if (interim) setPartial(interim);
                if (completed) {
                    setFinalText((prev) => (prev ? prev + " " + completed : completed));
                }
            };
            recRef.current.onend = () => {
                // 최종 문장이 있으면 확인 단계로
                if (finalTextRef.current || partialRef.current) {
                    const take = (finalTextRef.current || partialRef.current || "").trim();
                    setFinalText(take);
                    setPartial("");
                    setStage("confirm");
                } else {
                    // 아무 말도 못 들었으면 대기
                    setStage("idle");
                }
            };
            recRef.current.start();
        } catch (err) {
            console.error(err);
            setStage("idle");
        }
    };

    const stopListen = () => {
        try {
            recRef.current?.stop();
        } catch {}
    };

    // 최신값 참조용 ref
    const finalTextRef = useRef("");
    const partialRef = useRef("");
    useEffect(() => {
        finalTextRef.current = finalText;
    }, [finalText]);
    useEffect(() => {
        partialRef.current = partial;
    }, [partial]);

    /** ---------------------------
     *  백엔드 보내기
     *  --------------------------- */
    async function sendToBackend(userText) {
        // 채팅창에 사용자 발화 추가
        setMessages((prev) => [
            ...prev,
            { id: crypto.randomUUID(), role: "user", text: userText, time: nowTime() },
        ]);
        setStage("sending");

        // 타이핑 인디케이터(봇 말풍선 …)
        const typingId = crypto.randomUUID();
        setMessages((prev) => [
            ...prev,
            { id: typingId, role: "bot", text: "typing__", time: nowTime() },
        ]);

        // 여러 엔드포인트 시도: /api/chat → /chat
        const endpoints = [`${API_BASE}/api/chat`, `${API_BASE}/chat`];

        let responseText = "서버와 통신에 실패했어요. 잠시 후 다시 시도해 주세요.";
        for (const url of endpoints) {
            try {
                const res = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: userText }),
                });
                if (res.ok) {
                    const data = await res.json();
                    // data.answer / data.message 등 유연 처리
                    responseText = data.answer || data.message || JSON.stringify(data);
                    break;
                }
            } catch (e) {
                // 다음 후보 URL 시도
            }
        }

        // 타이핑 메시지 교체
        setMessages((prev) =>
            prev.map((m) => (m.id === typingId ? { ...m, text: responseText } : m))
        );
        setStage("idle");
    }

    /** ---------------------------
     *  UI 이벤트
     *  --------------------------- */
    const onMicClick = () => {
        if (stage === "listening") {
            stopListen();
        } else {
            startListen();
        }
    };

    const onConfirmYes = () => {
        const text = finalText.trim();
        setFinalText("");
        sendToBackend(text);
    };

    const onConfirmNo = () => {
        setFinalText("");
        setPartial("");
        setStage("idle");
        // 다시 듣기 원하시면 아래를 다시 실행할 수도 있습니다.
        // startListen();
    };

    return (
        <div className="chatbot-page">
            {/* 상단 헤더 */}
            <div className="chat-header">
                <button className="back-btn" onClick={() => navigate(-1)} aria-label="뒤로가기">
                    ←
                </button>
                <div className="chat-title">복지 도우미</div>
                <div className="header-spacer" />
            </div>

            {/* 대화 영역 */}
            <div className="chat-content">
                {messages.map((m) => (
                    <div
                        key={m.id}
                        className={`bubble-row ${m.role === "user" ? "right" : "left"}`}
                    >
                        <div className={`bubble-col ${m.role === "bot" ? "is-bot" : "is-user"}`}>
                            {m.role === "bot" && (
                                <img className="bot-avatar" src="/images/chatbot.png" alt="챗봇" />
                            )}
                            <div
                                className={`bubble ${
                                    m.role === "user" ? "bubble--user" : "bubble--bot"
                                }`}
                            >
                                {m.text === "typing__" ? (
                                    <span className="typing-dots">
                      <i></i><i></i><i></i>
                    </span>
                                ) : (
                                    m.text.split("\n").map((line, i) => <p key={i}>{line}</p>)
                                )}
                            </div>
                            <div className="time">{m.time}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 마이크 버튼만 표시 (idle) */}
            {stage === "idle" && (
                <button
                    className="floating-mic-btn"
                    onClick={onMicClick}
                    aria-label="음성 입력"
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3Z" stroke="white" strokeWidth="1.8"/>
                        <path d="M5 11a7 7 0 0 0 14 0" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                        <path d="M12 18v3" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                </button>
            )}

            {/* 모달 박스 표시 (listening/confirm/sending) */}
            {stage !== "idle" && (
                <div className="voice-modal" role="dialog" aria-modal="true">
                    <div className="voice-panel">
                        {/* 상태 라벨 */}
                        {stage === "listening" && (
                            <div className="voice-title">듣고 있어요</div>
                        )}
                        {stage === "confirm" && (
                            <div className="voice-title">음성 질문</div>
                        )}
                        {stage === "sending" && (
                            <div className="voice-title">전송 중…</div>
                        )}

                        {/* 내용 */}
                        <div className="voice-guide">
                            {stage === "listening" && (
                                <div className="listen-indicator">
                                    <span className="bars"><i/><i/><i/><i/></span>
                                    <span className="listen-text">{partial?.trim() || "듣고 있어요"}</span>
                                </div>
                            )}
                            {stage === "confirm" && (
                                <div className="confirm-box">
                                    <div className="confirm-text">{finalText || "…"}</div>
                                    <div className="confirm-caption">말씀하신 내용이 맞으신가요?</div>
                                    <div className="confirm-actions">
                                        <button className="btn btn--ghost" onClick={onConfirmNo}>다시 말하기</button>
                                        <button className="btn btn--primary" onClick={onConfirmYes}>네</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
