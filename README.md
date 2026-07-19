# 🏦 SHB Digital Expert Agents

Hệ đa tác tử (multi-agent) cho nghiệp vụ ngân hàng — Vietnam AI Innovation Challenge 2026 **Magic Team** · *Đối tác tin cậy \- Giải pháp phù hợp*

Một **hội đồng chuyên gia số** gồm 4 chuyên gia AI chuyên biệt, phối hợp để xử lý các yêu cầu nghiệp vụ ngân hàng phức tạp — với căn cứ số liệu thật, trích dẫn quy định nội bộ, cảnh báo rủi ro tự động, và quá trình ra quyết định **minh bạch, kiểm toán được**.

---

## ✨ Điểm nổi bật

- **4 Banking Expert chuyên biệt** — Credit, Legal & Compliance, Product, Operations  
- **Fast keyword routing** — chọn expert tức thì, né một lần gọi LLM (giảm chi phí \+ độ trễ)  
- **Planner/Orchestrator** — phân rã task phức tạp, giao đúng việc cho đúng expert  
- **RAG theo domain** — mỗi expert tra đúng kho kiến thức riêng, trích dẫn nguồn rõ ràng  
- **Tool Use / Function Calling** — 5 công cụ mô phỏng API ngân hàng (CIC, DTI, phê duyệt...)  
- **Toggle RAG & Risk Check thật** — bật/tắt ngay trong demo, backend thực sự thay đổi hành vi  
- **Case Memory** — tự trích xuất dữ kiện từ câu hỏi tiếng Việt, ghi nhớ hồ sơ, cache tool  
- **Agent Trace Dashboard** — Collaboration Flow, Task Decomposition, Tool Calls, Timing  
- **So sánh Multi-Agent vs Single-Agent** — chạy cùng câu hỏi, hiển thị song song

## 🏗️ Kiến trúc

┌─────────────────────────────────────────────────────────────┐

│                      Yêu cầu người dùng                       │

└───────────────────────────┬─────────────────────────────────┘

                            │

              ┌─────────────▼──────────────┐

              │   Fast Routing (keyword)    │  ← không gọi LLM

              └─────────────┬──────────────┘

                            │

              ┌─────────────▼──────────────┐

              │   Planner (phân rã task)    │  ← 1 lần gọi LLM

              └─────────────┬──────────────┘

                            │

        ┌───────────────────┼───────────────────┐

        │        Các Expert chạy SONG SONG        │

        │  ┌────────┐ ┌────────┐ ┌────────────┐  │

        │  │ Credit │ │ Legal  │ │  Product/  │  │  ← mỗi expert:

        │  │ Expert │ │ Expert │ │ Operations │  │    tool \+ RAG

        │  └────────┘ └────────┘ └────────────┘  │

        └───────────────────┬───────────────────┘

                            │

              ┌─────────────▼──────────────┐

              │      Synthesis Agent        │  ← tổng hợp

              └─────────────┬──────────────┘

                            │

              ┌─────────────▼──────────────┐

              │   Risk Check \+ Trace Log    │

              └─────────────┬──────────────┘

                            │

              ┌─────────────▼──────────────┐

              │   Khuyến nghị \+ nguồn dẫn   │

              └────────────────────────────┘

## 🛠️ Công nghệ

| Thành phần | Công nghệ |
| :---- | :---- |
| Backend | Python, FastAPI, FPT AI Factory |
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| Animation | Framer Motion |
| Icons | Lucide React |
| State | React Context \+ localStorage |
| Deploy | Backend: Render · Frontend: Vercel |

## 📂 Cấu trúc thư mục (Backend)

├── main.py                    \# Giao diện Streamlit (demo gốc)

├── api.py                     \# FastAPI wrapper — REST API cho Frontend

├── agents/

│   └── orchestrator.py        \# Pipeline điều phối: routing, planner, synthesis

├── tools/

│   ├── banking\_tools.py       \# 5 tool mô phỏng API ngân hàng

│   ├── fpt\_inference.py       \# Gọi mô hình FPT AI Factory

│   ├── memory.py              \# Case Memory — ghi nhớ hồ sơ, cache tool

│   └── rag.py                 \# Lightweight RAG

├── prompts/

│   └── system\_prompts.py      \# System prompt cho từng Expert \+ Orchestrator

├── data/

│   └── knowledge/             \# Kho kiến thức RAG (4 file .md theo domain)

└── requirements.txt

## 🌐 API Endpoints

| Method | Endpoint | Mô tả |
| :---- | :---- | :---- |
| POST | `/api/chat` | Xử lý yêu cầu qua pipeline đầy đủ. Body: `{message, use_rag, use_risk_check}` |
| POST | `/api/compare` | So sánh Single-Agent vs Multi-Agent trên cùng câu hỏi |
| GET | `/api/trace` | Trace của lần chạy gần nhất (cho Dashboard) |
| GET | `/api/experts` | Danh sách 4 expert |
| GET | `/api/knowledge-base` | Nội dung kho kiến thức RAG |
| GET | `/api/tools` | Danh sách 5 tool và mô tả |
| GET | `/api/system-info` | Thông tin cấu hình hệ thống (không lộ API key) |

## 🚀 Chạy thử (local)

### Backend

\# Cài dependencies

pip install \-r requirements.txt

\# Tạo file .env với các biến:

\#   FPT\_API\_KEY=...

\#   FPT\_BASE\_URL=...

\#   FPT\_MODEL\_NAME=...

\# Chạy Streamlit (demo gốc)

streamlit run main.py

\# HOẶC chạy FastAPI (cho Frontend gọi vào)

uvicorn api:app \--host 0.0.0.0 \--port 8001

### Frontend

cd frontend

npm install

\# Tạo .env.local:

\#   NEXT\_PUBLIC\_API\_URL=https://\<backend-url\>.onrender.com

npm run dev

\# Mở http://localhost:3000

## 🎯 Demo gợi ý

Nhập câu hỏi thẩm định vay để thấy toàn bộ pipeline hoạt động:

*"Khách hàng KH001 muốn vay 2 tỷ mua nhà, thu nhập 45 triệu/tháng, đang có khoản vay ô tô. Có duyệt được không, cần thủ tục gì?"*

Sau đó:

1. Xem **Dashboard** → Agent Trace hiển thị đầy đủ luồng xử lý thật  
2. Vào **Phân tích** → so sánh Single-Agent vs Multi-Agent  
3. Thử **tắt RAG** ở trang Chat rồi hỏi lại → thấy khác biệt khi không có tra cứu quy định

## ⚠️ Ghi chú

Hệ thống dùng dữ liệu khách hàng và quy định **mô phỏng (mock)** vì không có quyền truy cập hệ thống SHB thật. Kiến trúc được thiết kế để thay lớp tool mock bằng API thật mà không phải viết lại logic điều phối.

---

**Magic Team** — Vietnam AI Innovation Challenge 2026  
