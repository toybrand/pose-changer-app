import React, { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef, useLayoutEffect, useMemo } from "https://esm.sh/react@18.2.0";
import ReactDOM from "https://esm.sh/react-dom@18.2.0";
import { GoogleGenAI, Modality, Type } from "@google/genai";

// --- START OF SVG IONS ---
const FaUserAlt = (props) => <svg {...props} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm-45.7 48C79.8 304 0 383.8 0 482.3 0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"></path></svg>;
const FaEdit = (props) => <svg {...props} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-45.2-45.2c-5.2-5.2-13.5-5.2-18.7 0L480 35.9 569.8 125.7l19.7-19.7c5.2-5.2 5.2-13.5 0-18.7zM464 128H336c-17.7 0-32 14.3-32 32v128c0 17.7 14.3 32 32 32h128c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32zm-16 128h-96v-96h96v96zM0 128v288c0 17.7 14.3 32 32 32h288c17.7 0 32-14.3 32-32V320H224c-17.7 0-32-14.3-32-32V160H64c-17.7 0-32 14.3-32 32z"></path></svg>;
const FaArrowsAltH = (props) => <svg {...props} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M352.2 34.2c-12-12-31.5-12-43.5 0L216 126.9V96c0-17.7-14.3-32-32-32H32C14.3 64 0 78.3 0 96v152c0 13.4 8.3 25.1 20.4 29.7 12.1 4.6 25.7 0 34-11.6l43-51.6 92.7 92.7c12 12 31.5 12 43.5 0l92.2-92.2 43 51.6c8.3 11.6 21.9 16.2 34 11.6 12.1-4.6 20.4-16.3 20.4-29.7V96c0-17.7-14.3-32-32-32h-152c-17.7 0-32 14.3-32 32v30.9L352.2 34.2zM491.6 261.7c-12.1-4.6-25.7 0-34 11.6l-43 51.6-92.7-92.7c-12-12-31.5-12-43.5 0l-92.2 92.2-43-51.6c-8.3-11.6-21.9-16.2-34-11.6C8.3 266.9 0 278.6 0 292v152c0 17.7 14.3 32 32 32h152c17.7 0 32-14.3 32-32v-30.9l92.7 92.7c12 12 31.5 12 43.5 0l92.2-92.2 43 51.6c8.3 11.6 21.9 16.2 34 11.6 12.1-4.6 20.4-16.3 20.4-29.7V292c0-13.4-8.3-25.1-20.4-29.7z"></path></svg>;
const FaCamera = (props) => <svg {...props} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M149.1 64.8L138.7 96H64c-35.3 0-64 28.7-64 64v256c0 35.3 28.7 64 64 64h384c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64h-74.7l-10.4-31.2C355.4 26.2 327.5 0 296.2 0H215.8c-31.3 0-59.2 26.2-66.7 64.8zM256 416c-66.2 0-120-53.8-120-120s53.8-120 120-120 120 53.8 120 120-53.8 120-120 120z"></path></svg>;
const FaPalette = (props) => <svg {...props} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M204.3 5C104.9 24.4 24.8 104.3 5.2 203.4c-37 187 131.7 326.4 258.8 306.7 41.7-6.6 72.3-32.8 97.8-63.4l60.6 60.6c3.1 3.1 7.3 4.7 11.3 4.7 4.1 0 8.2-1.6 11.3-4.7 6.2-6.2 6.2-16.4 0-22.6l-60.6-60.6c30.6-25.5 56.8-56.1 63.4-97.8 19.7-127.1-99.7-295.8-306.7-258.8zM144 272c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm0-96c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm64 160c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm96-96c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"></path></svg>;
const FaRegImage = (props) => <svg {...props} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M448 80H64C28.7 80 0 108.7 0 144v224c0 35.3 28.7 64 64 64h384c35.3 0 64-28.7 64-64V144c0-35.3-28.7-64-64-64zM64 368V144h384v224H64zM256 192c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64zm176 144l-80-80-32 32-80-80-144 144h336z"></path></svg>;
const FaDownload = (props) => <svg {...props} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M416 199.5h-91.4V64H187.4v135.5H96L256 352 416 199.5zM96 402.8V448h320v-45.2H96z"></path></svg>;
const FaTimes = (props) => <svg {...props} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 352 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28 12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>;
const FaLightbulb = (props) => <svg {...props} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7zm-5 7a5 5 0 0 1 5-5 5 5 0 0 1 5 5c0 2.64-2 5-5 5s-5-2.36-5-5zm5 11h-2v1h2v-1zm2 0h-2v1h2v-1zm2 0h-2v1h2v-1z"></path></svg>;
const FaSyncAlt = (props) => <svg {...props} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M440.65 12.57l4 82.77A247.16 247.16 0 00255 8C114.62 8 8 114.62 8 256s106.62 248 247 248c98 0 182.42-56.95 223.23-139.43l-82.77-4A167.16 167.16 0 01255 424c-92.48 0-167-74.52-167-167s74.52-167 167-167c63.41 0 119.52 35.1 148.57 87.23l-82.77 4 153.18 74.32L504 12.57z"></path></svg>;
const FaLayerGroup = (props) => <svg {...props} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M496 224.22L256 95.78 16 224.22 256 352.66 496 224.22zM256 392.9L16 263.78v80l240 128.44 240-128.44v-80L256 392.9z"></path></svg>;
const FaUndo = (props) => <svg {...props} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M271.3 128.1c-76 5.2-138.8 68.3-138.8 145.9 0 79.4 62.4 144.4 140.8 144.4 69.4 0 128.8-49.3 138.8-115.3 1.4-9.3-5.2-17.6-14.6-17.6H384c-7.1 0-13.3 4.6-15.3 11.2-8.3 27.6-34.6 47.9-64.7 47.9-38.5 0-69.8-31.3-69.8-69.8s31.3-69.8 69.8-69.8c21.2 0 40.5 9.5 53.3 24.9l-42.3 42.3c-10 10-2.8 27.3 11.3 27.3H448c8.8 0 16-7.2 16-16V176c0-14.1-17.3-21.3-27.3-11.3l-46.1 46.1c-34.4-36.8-82.6-60-135.8-62.7z"></path></svg>;
// Fix: Renamed component from MapMarkerIcon to LocationMarkerIcon to avoid naming collision.
const LocationMarkerIcon = () => (
    <svg width="40" height="50" viewBox="0 0 40 50" style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.5))' }}>
        <g transform="translate(0, 5)">
            <circle cx="20" cy="20" r="15" fill="rgba(239, 68, 68, 0.8)" stroke="white" strokeWidth="2"/>
            <line x1="20" y1="5" x2="20" y2="-5" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <path d="M16 0 L20 -5 L24 0" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
    </svg>
);
const ComparisonHandleIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11 18H13V6H11V18ZM4 12L8 8V11H16V8L20 12L16 16V13H8V16L4 12Z" />
    </svg>
);
// --- END OF SVG ICONS ---

const photoToIllustrationStyles = [
    {
        category: "Ⅰ. 일러스트 스타일",
        styles: [
            { name: "교토 애니", description: "K-ON! 등 교토애니풍, 깨끗한 라인과 밝은 채색." },
            { name: "만화 잉크", description: "흑백선 중심, 스크린톤 질감, 잉크 느낌." },
            { name: "벡터 플랫", description: "광고용 벡터풍, 선명한 면 분리." },
            { name: "소프트 지브리", description: "지브리풍 수채화 질감, 따뜻한 색감, 부드러운 채도." },
            { name: "아동 도서", description: "둥근 형태, 파스텔 채도, 종이 질감 느낌." },
            { name: "웹툰 클린 라인", description: "웹툰용 단색 배경, 굵은 선, 감정 중심 연출." },
            { name: "이모티콘 코믹", description: "과장된 표정, 개그만화식 감정 표현." },
            { name: "치비/SD", description: "귀엽게 데포르메된 비율 (2~3등신 캐릭터)." },
            { name: "파스텔 플랫", description: "부드러운 파스텔톤, 외곽선 없음, 평면 색감. 나노바나나 기본 시그니처." },
            { name: "흑백 라인 아트", description: "노션풍 흑백 선화, 테두리만 강조." }
        ]
    },
    {
        category: "Ⅱ. 예술적 스타일",
        styles: [
            { name: "과슈 포스터", description: "불투명 수채화+포스터 페인팅 느낌." },
            { name: "디지털 매트 페인팅", description: "영화 컨셉아트용 배경 중심 스타일." },
            { name: "레트로 빈티지 포스터", description: "70~80년대 인쇄풍, 거친 질감." },
            { name: "사실주의 유화", description: "붓 터치가 보이는 사실적 유화 질감." },
            { name: "수묵화", description: "먹 선과 번짐, 한국/일본 수묵 풍." },
            { name: "수채화 워시", description: "투명 수채화, 가장자리 번짐, 종이 질감." },
            { name: "아르데코", description: "기하학적 선과 금속광 느낌." },
            { name: "연필 스케치", description: "연필선 중심의 흑백 드로잉." },
            { name: "인상파 붓터치", description: "반고흐, 모네풍 붓 터치 질감 강조." },
            { name: "콜라주 믹스 미디어", description: "종이·잉크·사진이 섞인 예술적 콜라주." }
        ]
    },
    {
        category: "Ⅲ. 캐릭터 & 인물",
        styles: [
            { name: "3D 인형 툰 셰이더", description: "DesignDoll 기반, toon shading." },
            { name: "K-아이돌 초상화", description: "부드러운 톤의 인물 초상 (Flux1-Context 추천)." },
            { name: "미니멀 윤곽선", description: "흑백 실루엣 + 최소 윤곽선." },
            { name: "세미리얼 애니", description: "현실적 인체 비례 + 애니 감성 눈·피부 표현." },
            { name: "셀 셰이딩 게임", description: "3D 애니풍 렌더 느낌, 클립스튜디오풍 색 분리." },
            { name: "스튜디오 인물 사진", description: "사진처럼 정면광과 인물 디테일 강조." },
            { name: "패션 일러스트", description: "길쭉한 인체 비율 + 질감 있는 의상 표현." },
            { name: "포즈 중심 드로잉", description: "빠른 포즈 중심, 질감 생략." },
            { name: "팝 카툰", description: "포스터풍, 밝은 톤, 볼드한 형태감." },
            { name: "픽셀 아트", description: "도트 기반 캐릭터 스타일." }
        ]
    },
    {
        category: "Ⅳ. 장르 확장 스타일",
        styles: [
            { name: "SF 리얼리즘", description: "미래 도시, 네온 조명, 포토리얼리즘." },
            { name: "로맨틱 소프트 글로우", description: "부드러운 역광, 핑크톤 빛효과." },
            { name: "사이버펑크 네온 글로우", description: "네온빛, 비 내리는 거리, 블루/핑크 톤." },
            { name: "스팀펑크", description: "기계 장식, 황동색 메탈톤." },
            { name: "일상물 웜톤", description: "일상적 풍경, 따뜻한 저녁빛." },
            { name: "초현실주의 드림스케이프", description: "초현실적 배경, 몽환적 톤." },
            { name: "판타지 매직", description: "마법 효과, 빛 입자, 고채도." },
            { name: "포스트 아포칼립스", description: "어둡고 거친 톤, 파손된 배경." },
            { name: "한국 전통 회화", description: "민화풍, 한복 중심 전통 채색화." },
            { name: "호러 스타일", description: "붉은 대비, 그림자 중심 조명." }
        ]
    },
    {
        category: "Ⅴ. 사진 기반 하이브리드 스타일",
        styles: [
            { name: "Flux 매크로 글로우", description: "피사체 강조 빛번짐 스타일." },
            { name: "Flux 포토리얼 인물", description: "Flux 기반 사실 인물 표현." },
            { name: "Flux1-Kontent 광고 스타일", description: "고해상도 광고용 포토렌더." },
            { name: "HDR 리얼리즘", description: "하이 다이내믹 레인지, 밝은 대비." },
            { name: "레트로 아날로그 포토", description: "90년대 사진톤, 약간의 색 번짐." },
            { name: "리얼리스틱 토이 포토", description: "인형사진처럼 연출된 피규어풍." },
            { name: "매크로 오브제 아트", description: "접사, 질감 중심 정물." },
            { name: "소프트 필름 그레인", description: "필름질감, 빈티지 그레인 효과." },
            { name: "시네마틱 스틸 프레임", description: "영화 스틸컷 같은 구도와 광원." },
            { name: "실사 인물 + CGI 배경", description: "인물 + 배경 CGI 혼합형." }
        ]
    },
    {
        category: "Ⅵ. 특수 스타일",
        styles: [
            { name: "AR/VR 홀로그램", description: "투명 홀로그램 효과." },
            { name: "그라디언트 미니멀리즘", description: "그라디언트 기반 미니멀 디자인." },
            { name: "네온 라인 드로잉", description: "검은 배경 + 형광선 라인." },
            { name: "복셀 로우폴리 3D", description: "큐브형 3D 그래픽." },
            { name: "블루프린트 설계도", description: "설계도풍 라인 스타일." },
            { name: "스티커 아웃라인", description: "하얀 테두리 스티커형 이미지." },
            { name: "아이소메트릭 룸", description: "위에서 본 입체 공간 (3D 룸뷰)." },
            { name: "유리/액체 효과", description: "투명 유리, 액체 질감 표현." },
            { name: "클레이 스톱모션", description: "점토인형 질감." },
            { name: "페이퍼 컷아웃", description: "종이 오려낸 듯한 질감." }
        ]
    }
];

const cameraParameters = [
    { name: "① 아웃포커스 인물 중심 (햇살, 필름 톤)", prompt: "cinematic portrait, soft background blur, shallow depth of field, natural daylight, creamy bokeh, DSLR look, RAW photo, 35mm lens, ISO100, f1.8 aperture, subject in sharp focus" },
    { name: "② 밝은 톤의 선명한 실사 (거리, 도심)", prompt: "street photography style, daylight exposure, motion sharpness, wide-angle 24mm lens, ISO400, f2.8 aperture, RAW clarity, dynamic lighting, photorealistic urban mood" },
    { name: "③ 자연광 다큐멘터리 (흐린 날, 일상)", prompt: "documentary photography, natural light diffusion, muted tones, 50mm lens, ISO800, f4.0 aperture, realistic color, subtle noise, handheld realism" },
    { name: "④ 실내 저조도 감성 (따뜻한 색감, 그레인)", prompt: "low-light interior shot, cinematic grain, soft lighting, ISO1600, f2.2 aperture, shallow focus, warm ambient tone, evening atmosphere" },
    { name: "⑤ 야간 클로즈업 (네온빛, 영화적 감정)", prompt: "night portrait, neon reflections, cinematic glow, telephoto 85mm lens, ISO3200, f1.4 aperture, soft bokeh, moody lighting, photorealistic" },
    { name: "⑥ 광각 구조 강조 (내부, 풍경)", prompt: "wide-angle shot, environmental detail, high clarity, ISO200, f5.6 aperture, RAW sharpness, ultra wide 16mm lens, architecture and space emphasis" },
    { name: "⑦ 중간 거리 인물+배경 조화", prompt: "medium telephoto shot, portrait with background compression, ISO1000, f3.5 aperture, soft cinematic focus, detailed highlights" },
    { name: "⑧ 야간 거리/조명 반사 강조", prompt: "night city street, high ISO grain, cinematic lighting, ISO6400, f2.0 aperture, moody contrast, ambient reflections, realistic neon bokeh" },
    { name: "⑨ 맑은 낮 클린 컷 (다큐, 건축)", prompt: "daylight clarity, crisp focus, landscape photography, 20mm wide lens, ISO200, f8.0 aperture, high contrast, bright tone" },
    { name: "⑩ 역광 실루엣 (영화 오프닝)", prompt: "backlight silhouette, cinematic sunlight, 85mm telephoto lens, ISO400, f2.8 aperture, high shutter speed, dramatic tone" }
];

const lightingControlPrompts = [
    { dir: 'top-left', icon: '↖', prompt: 'lighting from upper left, strong contrast shadow on right cheek and neck' },
    { dir: 'top', icon: '↑', prompt: 'lighting from top front, centered shadow under nose and chin, balanced highlights' },
    { dir: 'top-right', icon: '↗', prompt: 'lighting from upper right, deep shadow on left cheek, soft falloff' },
    { dir: 'left', icon: '←', prompt: 'lighting from left side, half face shadow, dramatic chiaroscuro style' },
    { dir: 'center', icon: '◉', prompt: 'backlighting, cinematic silhouette, strong rim light from behind the subject, front view' },
    { dir: 'right', icon: '→', prompt: 'lighting from right side, half face illuminated, cinematic portrait lighting' },
    { dir: 'bottom-left', icon: '↙', prompt: 'lighting from lower left, eerie upward shadows, underlighted mood' },
    { dir: 'bottom', icon: '↓', prompt: 'lighting from below front, hard shadow on upper face, horror-style underlight' },
    { dir: 'bottom-right', icon: '↘', prompt: 'lighting from lower right, shadow cast upward on left face, mysterious tone' }
];

const vehicleCameraAngles = {
    'Private Car': {
        name: '🚗 자가용 (Private Car)',
        angles: [
            { name: '운전석 뒤 (기본 대화)', prompt: 'camera angle: over-the-shoulder from backseat, view of driver and front passenger, dashboard visible' },
            { name: '조수석 시점', prompt: 'camera angle: passenger seat perspective, close-up on driver, shallow depth of field' },
            { name: '운전석 정면', prompt: 'camera angle: front-on view through windshield, focus on driver’s face, cinematic lighting' },
            { name: '운전석 측면', prompt: 'camera angle: side interior from driver’s window, showing both driver and passenger' },
            { name: '조수석 측면', prompt: 'camera angle: side interior from passenger’s window, looking toward driver' },
            { name: '계기판 시점', prompt: 'camera angle: dashboard-level view toward driver and windshield, steering wheel foreground' },
            { name: '앞유리 외부', prompt: 'camera angle: outside front windshield, wide shot of driver and passenger, road ahead' },
            { name: '백미러 반사', prompt: 'camera angle: close-up of rearview mirror reflection, driver’s eyes visible' },
            { name: '뒷좌석 정면', prompt: 'camera angle: straight-on from backseat center, symmetrical framing' },
            { name: '운전자 손 중심', prompt: 'camera angle: close-up on hands gripping the wheel, blurred city lights' }
        ]
    },
    'Bus': {
        name: '🚌 버스 (City Bus Interior)',
        angles: [
            { name: '중앙 통로', prompt: 'camera angle: wide shot down bus aisle, passengers seated and standing, symmetrical composition' },
            { name: '앞좌석 뒤', prompt: 'camera angle: over-the-shoulder from back of front seat, showing passengers ahead' },
            { name: '창가 측면', prompt: 'camera angle: side interior view along windows, daylight reflections' },
            { name: '운전석 근처', prompt: 'camera angle: low-angle close-up near driver’s seat, windshield road visible' },
            { name: '중간 좌석', prompt: 'camera angle: mid-bus perspective, focus on standing passengers holding straps' },
            { name: '후방 시점', prompt: 'camera angle: rear interior shot showing exit door and passengers' },
            { name: '입구문 시점', prompt: 'camera angle: from doorway looking into the bus, passengers entering' },
            { name: '창가 클로즈업', prompt: 'camera angle: close-up of reflection on window, passenger’s face visible' },
            { name: '전면 와이드', prompt: 'camera angle: exterior front of bus showing driver and windshield view' },
            { name: '천장 시점', prompt: 'camera angle: overhead interior shot from ceiling, showing seated rows' }
        ]
    },
    'Subway': {
        name: '🚇 지하철 (Subway / Metro)',
        angles: [
            { name: '정면 중앙', prompt: 'camera angle: centered front-facing down the subway car, symmetrical composition' },
            { name: '왼쪽 3/4', prompt: 'camera angle: three-quarter left interior, passengers visible along aisle' },
            { name: '오른쪽 3/4', prompt: 'camera angle: three-quarter right interior, mirrored symmetry' },
            { name: '좌석 측면', prompt: 'camera angle: full side interior view parallel to seats' },
            { name: '손잡이 근접', prompt: 'camera angle: close-up of hanging straps, focus on hands gripping them' },
            { name: '문 입구', prompt: 'camera angle: from doorway into car, passengers entering' },
            { name: '창가 반사', prompt: 'camera angle: window reflection of faces, moving blur background' },
            { name: '천장 시점', prompt: 'camera angle: high-angle interior showing crowd and seats' },
            { name: '바닥 시점', prompt: 'camera angle: low-angle shot from floor, dynamic movement' },
            { name: '객차 간 이동', prompt: 'camera angle: from connecting door, looking into next car' }
        ]
    },
    'Train': {
        name: '🚆 기차 (Train / Intercity Rail)',
        angles: [
            { name: '통로 중심', prompt: 'camera angle: down the aisle of train car, natural light from windows' },
            { name: '창가 시점', prompt: 'camera angle: side view focused on passenger by window, blurred landscape' },
            { name: '창문 반사', prompt: 'camera angle: reflection of passenger’s face in window, moving scenery outside' },
            { name: '객실 후방', prompt: 'camera angle: rear perspective of train cabin, passengers visible ahead' },
            { name: '기관실', prompt: 'camera angle: driver cabin, control panels and tracks ahead visible' },
            { name: '식당칸', prompt: 'camera angle: wide shot of dining car, people eating, warm lighting' },
            { name: '침대칸', prompt: 'camera angle: narrow space perspective inside sleeping berth' },
            { name: '교차 복도', prompt: 'camera angle: diagonal corridor shot, crossing passengers' },
            { name: '외부 주행', prompt: 'camera angle: exterior side shot of moving train, motion blur background' },
            { name: '차창 밖', prompt: 'camera angle: from inside looking out, countryside landscape' }
        ]
    },
    'Airplane': {
        name: '✈️ 비행기 (Airplane Interior)',
        angles: [
            { name: '통로 전방', prompt: 'camera angle: down the airplane aisle, flight attendants and seated passengers visible' },
            { name: '좌석 측면', prompt: 'camera angle: side view across two seats, soft cabin light' },
            { name: '창가 시점', prompt: 'camera angle: from passenger seat looking out airplane window, clouds visible' },
            { name: '창문 반사', prompt: 'camera angle: reflection of face in airplane window, sky outside' },
            { name: '조종석', prompt: 'camera angle: cockpit interior, pilots and instrument panels in focus' },
            { name: '후방 객실', prompt: 'camera angle: from back of cabin toward front, rows diminishing in depth' },
            { name: '기내 상단', prompt: 'camera angle: overhead interior, showing rows of passengers' },
            { name: '창가 손', prompt: 'camera angle: close-up of passenger’s hand on window, bright clouds outside' },
            { name: '야간 조명', prompt: 'camera angle: cabin at night, soft reading lights illuminating faces' },
            { name: '착륙 시점', prompt: 'camera angle: through cockpit windshield, runway approaching' }
        ]
    },
    'Taxi': {
        name: '🚕 택시 (Taxi / Ride Service)',
        angles: [
            { name: '대시보드 캠', prompt: 'camera angle: dashboard-mounted camera facing passengers, cinematic night lighting' },
            { name: '뒷좌석 중심', prompt: 'camera angle: straight-on from rear seat, showing driver and passenger interaction' },
            { name: '백미러 반사', prompt: 'camera angle: close-up of rearview mirror reflection, driver’s eyes visible' },
            { name: '외부 정면', prompt: 'camera angle: outside front windshield, city lights reflected' },
            { name: '운전자 어깨 뒤', prompt: 'camera angle: over-the-shoulder from behind driver, view of road ahead' },
            { name: '조수석 클로즈업', prompt: 'camera angle: passenger seat view, close-up on driver speaking' },
            { name: '창문 비', prompt: 'camera angle: side window with rain drops, blurred neon reflections' },
            { name: '하차 시점', prompt: 'camera angle: from sidewalk as passenger exits taxi' },
            { name: '야경 반사', prompt: 'camera angle: reflection of neon signs on car glass, driver silhouette' },
            { name: '계기판 조명', prompt: 'camera angle: close-up of taxi meter glowing in dark interior' }
        ]
    }
};


const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_WIDTH = 4096;
const MAX_HEIGHT = 4096;

const clampTargetSize = (width, height) => {
    let newWidth = Math.round(width);
    let newHeight = Math.round(height);

    if (newWidth <= 0 || newHeight <= 0) {
        return { width: 0, height: 0 };
    }

    const ratio = newWidth / newHeight;

    if (newWidth > MAX_WIDTH) {
        newWidth = MAX_WIDTH;
        newHeight = Math.round(newWidth / ratio);
    }

    if (newHeight > MAX_HEIGHT) {
        newHeight = MAX_HEIGHT;
        newWidth = Math.round(newHeight * ratio);
    }

    if (newWidth > MAX_WIDTH) {
        newWidth = MAX_WIDTH;
        newHeight = Math.round(newWidth / ratio);
    }

    return { width: newWidth, height: newHeight };
};


// Helper function to convert a base64 data URL to a GenerativePart object.
function fileToGenerativePart(base64DataUrl) {
    const match = base64DataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!match) {
        throw new Error("Invalid base64 data URL");
    }
    const mimeType = match[1];
    const data = match[2];
    return {
        inlineData: {
            mimeType,
            data,
        },
    };
}

const createWhiteMask = async (imageUrl) => {
    const img = await new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = "Anonymous";
        image.onload = () => resolve(image);
        image.onerror = (err) => reject(new Error("Image failed to load for mask creation."));
        image.src = imageUrl;
    });

    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = img.naturalWidth;
    maskCanvas.height = img.naturalHeight;
    const ctx = maskCanvas.getContext('2d');
    if (!ctx) throw new Error("Could not get canvas context for mask.");
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    
    return maskCanvas.toDataURL('image/png');
};

const createGridImage = async (imageUrl, cols, rows) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            const gridWidth = img.naturalWidth * cols;
            const gridHeight = img.naturalHeight * rows;
            const canvas = document.createElement('canvas');
            canvas.width = gridWidth;
            canvas.height = gridHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return reject(new Error("Could not get canvas context."));
            }

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    ctx.drawImage(img, c * img.naturalWidth, r * img.naturalHeight);
                }
            }
            
            resolve({
                gridImageUrl: canvas.toDataURL('image/png'),
                gridWidth,
                gridHeight
            });
        };
        img.onerror = (err) => {
            reject(new Error("Image failed to load for grid creation."));
        };
        img.src = imageUrl;
    });
};

const ImageUpload = ({ title, subtitle, imageUrl, onImageUpload, disabled = false, heightClass = 'h-96' }) => {
    const fileInputRef = useRef(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const handleBoxClick = () => {
        if (!disabled && !imageUrl && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const processFile = (file) => {
        if (file && SUPPORTED_IMAGE_FORMATS.includes(file.type)) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageUpload(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        processFile(file);
        event.target.value = null; // Reset file input
    };

    const handleRemoveImage = (e) => {
        e.stopPropagation();
        onImageUpload(null);
    };

    const handleDragEvents = (e, isOver) => {
        if(disabled) return;
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(isOver);
    };

    const handleDrop = (e) => {
        if(disabled) return;
        handleDragEvents(e, false);
        const file = e.dataTransfer.files[0];
        processFile(file);
    };

    const baseClasses = `${heightClass} bg-slate-800 rounded-lg p-2 border-2 border-dashed flex items-center justify-center relative group transition-colors duration-300`;
    const draggingClasses = isDraggingOver ? "border-pink-500 bg-slate-700" : "border-slate-700";
    const hoverClasses = !disabled && !imageUrl ? "hover:border-pink-500" : "";
    const disabledClasses = disabled ? 'cursor-not-allowed opacity-50' : '';

    return (
        <div className={`flex flex-col space-y-3 ${disabledClasses}`}>
            {title && <h3 className="font-semibold text-slate-400">{title}</h3>}
            <div
                className={`${baseClasses} ${draggingClasses} ${hoverClasses}`}
                onClick={handleBoxClick}
                onDragEnter={(e) => handleDragEvents(e, true)}
                onDragLeave={(e) => handleDragEvents(e, false)}
                onDragOver={(e) => handleDragEvents(e, true)}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                    disabled={disabled}
                />
                {imageUrl ? (
                    <>
                        <img src={imageUrl} alt={title} className="object-contain max-h-full rounded-md" />
                        <div
                            className={`absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${!disabled && 'cursor-pointer'}`}
                            onClick={() => !disabled && fileInputRef.current.click()}
                            onDrop={handleDrop}
                            onDragEnter={(e) => handleDragEvents(e, true)}
                            onDragLeave={(e) => handleDragEvents(e, false)}
                            onDragOver={(e) => handleDragEvents(e, true)}
                        >
                           {!disabled && <div className="text-center"><p className="text-white font-bold">Change Image</p></div>}
                           {!disabled && <button 
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 bg-slate-800/80 hover:bg-red-600 text-white font-bold p-2 rounded-full leading-none transition-colors"
                                aria-label="Remove Image"
                            >
                                <FaTimes className="h-4 w-4" />
                            </button>}
                        </div>
                    </>
                ) : (
                    <div className={`text-center text-slate-500 ${!disabled && 'cursor-pointer'}`}>
                        <FaRegImage className="mx-auto h-12 w-12 mb-2" />
                        <p className="font-semibold text-slate-300">{isDraggingOver ? "Drop image here" : subtitle}</p>
                        <p className="text-xs mt-1">(Image files supported)</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const LightingOverlay = ({ lighting }) => {
    if (lighting.autoLight || !lighting.direction) {
        return null;
    }

    const getPosition = (direction) => {
        const positions = {
            'top-left': '100% 100%', 'top': '50% 100%', 'top-right': '0% 100%',
            'left': '100% 50%', 'right': '0% 50%',
            'bottom-left': '100% 0%', 'bottom': '50% 0%', 'bottom-right': '0% 0%',
        };
        return positions[direction] || '50% 50%';
    };
    
    const getOppositePosition = (direction) => {
        const opposites = {
            'top-left': '0% 0%', 'top': '50% 0%', 'top-right': '100% 0%',
            'left': '0% 50%', 'right': '100% 50%',
            'bottom-left': '0% 100%', 'bottom': '50% 100%', 'bottom-right': '100% 100%',
        };
        return opposites[direction] || '50% 50%';
    }

    const getLightColor = (temp, intensity) => {
        const ratio = Math.max(0, Math.min(1, (temp - 1000) / 9000));
        const r = Math.round(255 * (1 - ratio));
        const b = Math.round(255 * ratio);
        const g = Math.round((r + b) / 3);
        const opacity = Math.pow(intensity / 100, 0.7) * 0.75;
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    const getShadowOpacity = (intensity) => {
        return (intensity / 100) * 0.5;
    };
    
    const lightGradient = `radial-gradient(circle at ${getPosition(lighting.direction)}, ${getLightColor(lighting.temp, lighting.intensity)} 0%, transparent 50%)`;
    const shadowGradient = `radial-gradient(circle at ${getOppositePosition(lighting.direction)}, rgba(0, 0, 0, ${getShadowOpacity(lighting.intensity)}) 0%, transparent 50%)`;

    const style = {
        backgroundImage: `${shadowGradient}, ${lightGradient}`,
        mixBlendMode: 'overlay',
    };

    return <div className="absolute inset-0 w-full h-full pointer-events-none" style={style} />;
};


const EditorCanvas = React.forwardRef(({ imageSrc, brushSize, lighting }, ref) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const isDrawing = useRef(false);
    const paths = useRef([]);
    const lastPos = useRef({ x: 0, y: 0 });

    const getCoords = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        
        const scale = rect.width / canvas.width;
        
        return { 
            x: (clientX - rect.left) / scale, 
            y: (clientY - rect.top) / scale
        };
    };
    
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.7)';

        paths.current.forEach(path => {
            ctx.lineWidth = path.brushSize;
            ctx.beginPath();
            if (path.points.length > 0) {
                ctx.moveTo(path.points[0].x, path.points[0].y);
                path.points.forEach(point => ctx.lineTo(point.x, point.y));
                ctx.stroke();
            }
        });
    }, []);
    
    const startDrawing = (e) => {
        isDrawing.current = true;
        const coords = getCoords(e);
        lastPos.current = coords;
        paths.current.push({ brushSize, points: [coords] });
    };

    const drawing = (e) => {
        if (!isDrawing.current) return;
        const coords = getCoords(e);
        paths.current[paths.current.length - 1].points.push(coords);
        draw();
    };

    const stopDrawing = () => {
        isDrawing.current = false;
    };
    
    useImperativeHandle(ref, () => ({
        undo: () => { paths.current.pop(); draw(); },
        reset: () => { paths.current = []; draw(); },
        hasDrawing: () => paths.current.length > 0,
        getMask: () => {
            const canvas = canvasRef.current;
            if (!canvas || canvas.width === 0 || canvas.height === 0) return null;
            const maskCanvas = document.createElement('canvas');
            maskCanvas.width = canvas.width;
            maskCanvas.height = canvas.height;
            const maskCtx = maskCanvas.getContext('2d');
            
            maskCtx.fillStyle = 'black';
            maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
            
            if (paths.current.length === 0) {
                maskCtx.fillStyle = 'white';
                maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
            } else {
                maskCtx.lineCap = 'round';
                maskCtx.lineJoin = 'round';
                maskCtx.strokeStyle = 'white';
                paths.current.forEach(path => {
                    maskCtx.lineWidth = path.brushSize;
                    maskCtx.beginPath();
                    if(path.points.length > 0) {
                        maskCtx.moveTo(path.points[0].x, path.points[0].y);
                        path.points.forEach(point => maskCtx.lineTo(point.x, point.y));
                        maskCtx.stroke();
                    }
                });
            }
            return maskCanvas.toDataURL('image/png');
        },
    }), [draw, brushSize]);
    

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            if (!container || !canvas) return;
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;
            const imageAspectRatio = image.width / image.height;
            const containerAspectRatio = containerWidth / containerHeight;

            let canvasWidth, canvasHeight;

            if (imageAspectRatio > containerAspectRatio) {
                canvasWidth = containerWidth;
                canvasHeight = containerWidth / imageAspectRatio;
            } else {
                canvasHeight = containerHeight;
                canvasWidth = containerHeight * imageAspectRatio;
            }
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            draw();
        };
    }, [imageSrc, draw]);

    return (
        <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
             <img src={imageSrc} alt="Editable" className="object-contain max-w-full max-h-full rounded-md pointer-events-none" />
             <LightingOverlay lighting={lighting} />
             <canvas 
                ref={canvasRef} 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-crosshair"
                onMouseDown={startDrawing} onMouseMove={drawing} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
                onTouchStart={startDrawing} onTouchMove={drawing} onTouchEnd={stopDrawing}
             />
        </div>
    );
});

const ImageComparisonSlider = ({ beforeImage, afterImage }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    const handleMove = useCallback((clientX) => {
        if (!isDragging || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        let percentage = (x / rect.width) * 100;
        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;
        setSliderPosition(percentage);
    }, [isDragging]);

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleTouchStart = (e) => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const handleMouseMove = useCallback((e) => {
        handleMove(e.clientX);
    }, [handleMove]);

    const handleTouchMove = useCallback((e) => {
        handleMove(e.touches[0].clientX);
    }, [handleMove]);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchend', handleTouchEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging, handleMouseMove, handleTouchMove]);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full select-none overflow-hidden rounded-lg"
            onMouseUp={handleMouseUp}
            onTouchEnd={handleTouchEnd}
            onMouseLeave={handleMouseUp}
        >
            <img
                src={beforeImage}
                alt="Before"
                className="block w-full h-full object-contain pointer-events-none"
            />
            <img
                src={afterImage}
                alt="After"
                className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
                style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            />
            <div
                className="absolute top-0 bottom-0 w-1 bg-white/70 cursor-ew-resize group"
                style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 text-slate-800 shadow-lg group-hover:scale-110 transition-transform">
                    <ComparisonHandleIcon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
};

const getResizeCursor = (handle) => {
    switch(handle) {
        case 'tl':
        case 'br':
            return 'nwse-resize';
        case 'tr':
        case 'bl':
            return 'nesw-resize';
        case 't':
        case 'b':
            return 'ns-resize';
        case 'l':
        case 'r':
            return 'ew-resize';
        default:
            return 'move';
    }
};

const VintageStyleModal = ({ isOpen, onClose, onSubmit }) => {
    const [details, setDetails] = useState({ era: '', hairstyle: '', features: '', clothing: '', background: '', extra: '' });

    useEffect(() => {
        if (isOpen) {
            setDetails({ era: '', hairstyle: '', features: '', clothing: '', background: '', extra: '' });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSubmit(details);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-slate-800 rounded-lg p-6 w-full max-w-lg space-y-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-slate-200">시대를 초월한 당신의 모습 만들기</h2>
                <p className="text-sm text-slate-400">사진 속 인물을 원하는 시대의 모습으로 변신시키기 위한 정보를 입력하세요.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="era" className="text-sm font-medium text-slate-400 mb-1 block">시대 (Era)</label>
                        <input type="text" name="era" value={details.era} onChange={handleInputChange} placeholder="예: 1970년대, 조선시대" className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="hairstyle" className="text-sm font-medium text-slate-400 mb-1 block">헤어스타일 (Hairstyle)</label>
                        <input type="text" name="hairstyle" value={details.hairstyle} onChange={handleInputChange} placeholder="예: 긴 곱슬머리, 상투" className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md" />
                    </div>
                     <div>
                        <label htmlFor="features" className="text-sm font-medium text-slate-400 mb-1 block">얼굴 특징 (Facial Features)</label>
                        <input type="text" name="features" value={details.features} onChange={handleInputChange} placeholder="예: 콧수염, 안경" className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md" />
                    </div>
                     <div>
                        <label htmlFor="clothing" className="text-sm font-medium text-slate-400 mb-1 block">의상 (Clothing)</label>
                        <input type="text" name="clothing" value={details.clothing} onChange={handleInputChange} placeholder="예: 나팔바지, 한복" className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md" />
                    </div>
                </div>
                <div>
                    <label htmlFor="background" className="text-sm font-medium text-slate-400 mb-1 block">배경 (Background)</label>
                    <input type="text" name="background" value={details.background} onChange={handleInputChange} placeholder="예: 캘리포니아 해변, 경복궁" className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md" />
                </div>
                 <div>
                    <label htmlFor="extra" className="text-sm font-medium text-slate-400 mb-1 block">추가 요청사항 (Optional)</label>
                    <textarea name="extra" value={details.extra} onChange={handleInputChange} rows={3} placeholder="그 외 특별히 원하는 점을 입력하세요." className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md resize-none" />
                </div>
                
                <div className="flex justify-end space-x-3 pt-2">
                    <button onClick={onClose} className="bg-slate-600 text-slate-300 font-bold py-2 px-4 rounded-lg hover:bg-slate-700">취소</button>
                    <button onClick={handleSubmit} className="bg-pink-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-pink-700">생성하기</button>
                </div>
            </div>
        </div>
    );
};

const getKeywordEnhancedPrompt = (userInput) => {
    if (!userInput) return null;
    const lowerCaseInput = userInput.toLowerCase();
    
    const highImpactKeywords = {
        'night|밤|저녁': `**URGENT TRANSFORMATION:** Convert this photo to a **deep night scene**. The sky must be dark, possibly with stars. If there are buildings, their windows **must be illuminated from within**. Streetlights should cast realistic glows. The mood should be unmistakably nocturnal. The user's specific request is '${userInput}'.`,
        'sunset|노을|석양': `**URGENT TRANSFORMATION:** Re-imagine this photo during a **vibrant, colorful sunset**. The sky should be filled with dramatic orange, pink, and purple hues. The lighting should be warm and long, casting deep shadows. The entire scene must be bathed in the golden hour light. The user's specific request is '${userInput}'.`,
        'snow|눈': `**URGENT TRANSFORMATION:** Cover the scene in a **thick blanket of fresh snow**. All horizontal surfaces like ground, roofs, and branches must be snow-covered. The air should feel cold; add falling snowflakes if appropriate. The lighting should be soft and diffused as is common on a snowy day. The user's specific request is '${userInput}'.`,
        'rain|비': `**URGENT TRANSFORMATION:** Transform this into a **rainy day scene**. Surfaces should be wet and reflective. Add visible rain streaks or a misty atmosphere. The mood should be melancholic or dramatic, with cool, desaturated colors. The user's specific request is '${userInput}'.`,
        'clear sky|sunny|화창|맑은': `**URGENT TRANSFORMATION:** Make the scene a **perfectly clear, sunny day**. The sky must be a bright, saturated blue with no clouds. The lighting should be direct and strong, creating sharp, defined shadows. The overall mood should be bright, cheerful, and vibrant. The user's specific request is '${userInput}'.`,
        'autumn|fall|가을': `**URGENT TRANSFORMATION:** Convert the scene to the peak of **autumn**. Foliage on trees must be vibrant oranges, reds, and yellows. The ground can be scattered with fallen leaves. The lighting should be warm and golden, characteristic of an autumn afternoon. The user's specific request is '${userInput}'.`
    };

    const COHESION_INSTRUCTION = " **CRITICAL: Treat the entire canvas as a single, cohesive scene. All stylistic and atmospheric effects must be applied consistently from edge to edge for a seamless, photorealistic result, especially if the image was previously edited or expanded.**";

    for (const key in highImpactKeywords) {
        const regex = new RegExp(key, "i");
        if (regex.test(lowerCaseInput)) {
            return highImpactKeywords[key] + COHESION_INSTRUCTION;
        }
    }
    
    return null;
};

const initialPromptState = { instructions: '', englishPrompt: '' };
const App = () => {
    const [apiKey, setApiKey] = useState(null);
    const [authStatus, setAuthStatus] = useState('waiting'); // 'waiting', 'received', 'error'

    const [activeMenu, setActiveMenu] = useState("Pose");
    const [sourceImage, setSourceImage] = useState(null);
    const [poseReferenceImage, setPoseReferenceImage] = useState(null);
    const [activeImage, setActiveImage] = useState(null); 
    const [imageHistory, setImageHistory] = useState([]);
    const [currentBaseImage, setCurrentBaseImage] = useState(null);
    const [sessionOriginalImage, setSessionOriginalImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Generating...");
    const [errorMessage, setErrorMessage] = useState(null);
    
    const [prompts, setPrompts] = useState({
        Pose: { ...initialPromptState },
        Editor: { ...initialPromptState },
        Expand: { ...initialPromptState },
        CameraPosition: { ...initialPromptState },
        Style: { ...initialPromptState },
    });
    
    const canvasRef = useRef(null);
    const canvasContainerRef = useRef(null);
    const imageRef = useRef(null);
    const cameraFileInputRef = useRef(null);
    const [brushSize, setBrushSize] = useState(40);
    const [lighting, setLighting] = useState({ intensity: 50, temp: 5128, direction: 'top', canvasLighting: true, autoLight: false });
    const [editorEntryImage, setEditorEntryImage] = useState(null);
    const prevMenuRef = useRef(activeMenu);

    // Expand state
    const [aspectRatio, setAspectRatio] = useState("16:9");
    const [targetSize, setTargetSize] = useState({ width: 0, height: 0 });
    const [expansionImageDetails, setExpansionImageDetails] = useState({ src: null, naturalWidth: 0, naturalHeight: 0 });
    const [expandSourceImage, setExpandSourceImage] = useState(null);
    const [expandSessionStartImage, setExpandSessionStartImage] = useState(null);
    const [expandSourceGeometry, setExpandSourceGeometry] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [regenerateZones, setRegenerateZones] = useState({});
    const [isDraggingOverCanvas, setIsDraggingOverCanvas] = useState(false);
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const [imageDisplaySize, setImageDisplaySize] = useState({ width: 0, height: 0 });
    const [scaledFrameDims, setScaledFrameDims] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });
    const [isResizing, setIsResizing] = useState({ active: false, handle: null });
    const resizeStartRef = useRef(null);
    const [originalImageRectInFrame, setOriginalImageRectInFrame] = useState(null);

    // Pan and Zoom state for Expand Canvas
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const panStartRef = useRef({ x: 0, y: 0 });

    // Pan and Zoom state for generic views
    const [viewTransform, setViewTransform] = useState({ scale: 1, pan: { x: 0, y: 0 } });
    const [isViewPanning, setIsViewPanning] = useState(false);
    const viewPanStartRef = useRef({ x: 0, y: 0 });

    // --- Camera Position State ---
    const [croppedImage, setCroppedImage] = useState(null);
    const [reframedImage, setReframedImage] = useState(null);
    const [cameraPositionOriginal, setCameraPositionOriginal] = useState({ src: null, naturalWidth: 0, naturalHeight: 0 });
    const [imageDisplayBounds, setImageDisplayBounds] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const [cameraFrameRect, setCameraFrameRect] = useState({ x: 0, y: 0, width: 100, height: 100 });
    const [isDraggingFrame, setIsDraggingFrame] = useState(false);
    const [isResizingFrame, setIsResizingFrame] = useState({ active: false, handle: null });
    const frameInteractionStartRef = useRef(null);

    // --- Style Menu State ---
    const [selectedStyle, setSelectedStyle] = useState('');
    const [isVintageModalOpen, setIsVintageModalOpen] = useState(false);
    const [moviePosterStarring, setMoviePosterStarring] = useState('');
    const [moviePosterDetails, setMoviePosterDetails] = useState({
        title: '',
        tagline: '',
        credits: '',
        release: '',
    });
    const [mapMarker, setMapMarker] = useState(null); // The placed marker: {x, y, rotation}
    const [hoverMarkerPos, setHoverMarkerPos] = useState(null); // The preview marker: {x, y}
    const [isPlacingMarker, setIsPlacingMarker] = useState(false);
    const [displayedImageGeom, setDisplayedImageGeom] = useState(null);
    const [photoDetails, setPhotoDetails] = useState({ background: '', nationality: '' });
    const [photoToIllustrationStyle, setPhotoToIllustrationStyle] = useState(null);
    const [openIllustrationCategory, setOpenIllustrationCategory] = useState(null);
    const [selectedCameraParameter, setSelectedCameraParameter] = useState(null);
    const [selectedLightingDirection, setSelectedLightingDirection] = useState(null);
    const [styleComparisonOriginal, setStyleComparisonOriginal] = useState(null);

    // --- Character Design State ---
    const [characterDesignSourceImage, setCharacterDesignSourceImage] = useState(null);
    const [activeCharacterDesignSubMenu, setActiveCharacterDesignSubMenu] = useState(null);
    
    // --- Clothing Swap State ---
    const [clothingSwapSourceImage, setClothingSwapSourceImage] = useState(null);
    const [clothingSwapReferenceImage, setClothingSwapReferenceImage] = useState(null);

    // --- Transportation Interior State ---
    const [transportSourceImage, setTransportSourceImage] = useState(null);
    const [transportCharacterImage, setTransportCharacterImage] = useState(null);
    const [selectedVehicleType, setSelectedVehicleType] = useState('');
    const [selectedCameraAngle, setSelectedCameraAngle] = useState('');
    
    // --- Product Mockup State ---
    const [productMockupObjectImage, setProductMockupObjectImage] = useState(null);
    const [productMockupDesignImage, setProductMockupDesignImage] = useState(null);

    useEffect(() => {
        const handleMessage = (event) => {
            // IMPORTANT: For security, always check the origin of the message.
             // For local development, you might want to allow the current window's origin
            const allowedOrigins = ["https://aitoolshub.kr", window.location.origin];
            if (!allowedOrigins.includes(event.origin)) {
                console.warn("Message received from untrusted origin:", event.origin);
                return;
            }

            const { type, apiKey: receivedApiKey } = event.data;
            if (type === 'GEMINI_API_KEY' && receivedApiKey) {
                setApiKey(receivedApiKey);
                setAuthStatus('received');
            }
        };

        window.addEventListener('message', handleMessage);

        // Timeout to handle cases where the app is not in an iframe or the message is not sent
        const timer = setTimeout(() => {
            if (authStatus === 'waiting' && !window.frameElement) { // Only show error if not in iframe
                 setAuthStatus('error');
            } else if (authStatus === 'waiting' && window.frameElement) {
                // It's in an iframe but hasn't received a key. Keep waiting or show a different message.
                // For now, we'll just let it wait.
            }
        }, 5000); // 5 seconds

        return () => {
            window.removeEventListener('message', handleMessage);
            clearTimeout(timer);
        };
    }, [authStatus]);
    
    const { instructions, englishPrompt } = useMemo(() => prompts[activeMenu] || initialPromptState, [prompts, activeMenu]);
    
    const setInstructions = useCallback((value) => {
        setPrompts(p => ({ ...p, [activeMenu]: { ...p[activeMenu], instructions: value } }));
    }, [activeMenu]);
    
    const setEnglishPrompt = useCallback((value) => {
        setPrompts(p => ({ ...p, [activeMenu]: { ...p[activeMenu], englishPrompt: value } }));
    }, [activeMenu]);

    useEffect(() => {
        const prevMenu = prevMenuRef.current;
        if (activeMenu === 'Editor' && prevMenu !== 'Editor') {
            setEditorEntryImage(activeImage);
        }
        setViewTransform({ scale: 1, pan: { x: 0, y: 0 } });
        prevMenuRef.current = activeMenu;
    }, [activeMenu, activeImage]);

    useEffect(() => {
        if (selectedStyle !== 'upscale') {
            setStyleComparisonOriginal(null);
        }
        if (selectedStyle !== 'map-view') {
            setMapMarker(null);
            setHoverMarkerPos(null);
            setIsPlacingMarker(false);
        }
        if (selectedStyle !== 'illustration-to-photo') {
            setPhotoDetails({ background: '', nationality: '' });
        }
        if (selectedStyle !== 'photo-to-illustration') {
            setPhotoToIllustrationStyle(null);
            setOpenIllustrationCategory(null);
        }
        if (selectedStyle !== 'camera-parameters') {
            setSelectedCameraParameter(null);
        }
        if (selectedStyle !== 'lighting-control') {
            setSelectedLightingDirection(null);
        }
        if (selectedStyle !== 'movie-poster') {
            setMoviePosterStarring('');
            setMoviePosterDetails({ title: '', tagline: '', credits: '', release: '' });
        }
        // When switching to Character Design, if there's an active image, use it as the source.
        if (selectedStyle === 'character-design' && activeImage && !characterDesignSourceImage) {
            setCharacterDesignSourceImage(activeImage);
        }
        if (selectedStyle !== 'clothing-swap') {
            setClothingSwapSourceImage(null);
            setClothingSwapReferenceImage(null);
        }
        if (selectedStyle !== 'create-transport-interior') {
            setTransportSourceImage(null);
            setTransportCharacterImage(null);
            setSelectedVehicleType('');
            setSelectedCameraAngle('');
        }
        if (selectedStyle !== 'product-mockup') {
            setProductMockupObjectImage(null);
            setProductMockupDesignImage(null);
        }
    }, [selectedStyle, activeImage, characterDesignSourceImage]);

    useLayoutEffect(() => {
        const calculateGeom = () => {
            if (imageRef.current && canvasContainerRef.current) {
                const img = imageRef.current;
                const containerRect = canvasContainerRef.current.getBoundingClientRect();
                const { x, y, width, height } = img.getBoundingClientRect();
                setDisplayedImageGeom({
                    x: x - containerRect.left,
                    y: y - containerRect.top,
                    width,
                    height,
                });
            } else {
                setDisplayedImageGeom(null);
            }
        };
        calculateGeom();
        window.addEventListener('resize', calculateGeom);
        return () => window.removeEventListener('resize', calculateGeom);
    }, [activeImage, activeMenu, selectedStyle]);

    const updateActiveImage = (newImage) => {
        if (!newImage) return;
        setActiveImage(newImage);
        setImageHistory(prev => [...prev, newImage]);
    };
    
    const handleUndo = useCallback(() => {
        if (imageHistory.length <= 1) {
             // If only the initial image is left, this acts like a reset for the current state.
            const original = imageHistory[0];
            setActiveImage(original);
            setCurrentBaseImage(original);
            setImageHistory([original]);

            if (activeMenu === 'Expand') {
                setIsExpanded(false);
                setExpandSourceImage(original);
                setExpandSessionStartImage(original);
            }
            if(activeMenu === 'CameraPosition') {
                setCroppedImage(null);
                setReframedImage(null);
            }
            return;
        }

        const newHistory = imageHistory.slice(0, -1);
        const newActiveImage = newHistory[newHistory.length - 1];

        // This logic handles complex state rollbacks for specific menus
        if (activeMenu === 'Expand' && newActiveImage === expandSessionStartImage) {
             setIsExpanded(false);
        }

        setImageHistory(newHistory);
        setActiveImage(newActiveImage);
        setCurrentBaseImage(newActiveImage);

        if (activeMenu === 'CameraPosition') {
            if (reframedImage === imageHistory[imageHistory.length - 1]) {
                setReframedImage(null);
            }
             if (croppedImage === imageHistory[imageHistory.length - 1]) {
                setCroppedImage(null);
            }
        }
    
    }, [imageHistory, activeMenu, reframedImage, croppedImage, expandSessionStartImage]);

    const handleDownload = useCallback(() => {
        if (!activeImage) return;
        const link = document.createElement('a');
        link.href = activeImage;
        link.download = `generated-image-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [activeImage]);

    useEffect(() => {
        // When entering the Camera Position tab with a new image, establish it as the "original" for this session.
        if (activeMenu === 'CameraPosition' && activeImage && (!cameraPositionOriginal.src || cameraPositionOriginal.src !== activeImage)) {
            const img = new Image();
            img.onload = () => {
                setCameraPositionOriginal({
                    src: activeImage,
                    naturalWidth: img.naturalWidth,
                    naturalHeight: img.naturalHeight,
                });
            };
            img.onerror = () => {
                setCameraPositionOriginal({ src: activeImage, naturalWidth: 0, naturalHeight: 0 });
            };
            img.src = activeImage;
        }
    }, [activeMenu, activeImage, cameraPositionOriginal.src]);
    
    useEffect(() => {
        if (activeMenu === 'Expand' && activeImage && !isExpanded) {
            setExpandSourceImage(activeImage);
            setExpandSessionStartImage(activeImage);
        }
    }, [activeMenu, activeImage, isExpanded]);

    const getMaskForExpansion = useCallback((direction = 'all') => {
        if (!expansionImageDetails.src || !targetSize.width || !targetSize.height || !scaledFrameDims) return null;
    
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = targetSize.width;
        maskCanvas.height = targetSize.height;
        const ctx = maskCanvas.getContext('2d');
        const overlap = 32; // Increased from 16 to give the model more context for blending.
    
        const scale = targetSize.width / scaledFrameDims.width;
    
        const isRegeneratingAll = direction === 'all' && isExpanded;
        const geometry = isRegeneratingAll ? expandSourceGeometry : { position: imagePosition, displaySize: imageDisplaySize };

        if (!geometry) {
            console.error("Mask generation failed: geometry is missing.");
            return null;
        }

        const rectForMasking = (direction !== 'all' && originalImageRectInFrame) 
            ? originalImageRectInFrame
            : {
                x: Math.round(geometry.position.x * scale),
                y: Math.round(geometry.position.y * scale),
                width: Math.round(geometry.displaySize.width * scale),
                height: Math.round(geometry.displaySize.height * scale),
             };
    
        const { x, y, width, height } = rectForMasking;
    
        if (direction === 'all') {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
            ctx.fillStyle = 'black';
            const overlappedRect = {
                x: x + overlap,
                y: y + overlap,
                width: Math.max(0, width - 2 * overlap),
                height: Math.max(0, height - 2 * overlap),
            };
            ctx.fillRect(overlappedRect.x, overlappedRect.y, overlappedRect.width, overlappedRect.height);
        } else {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
            ctx.fillStyle = 'white';
    
            const right = x + width;
            const bottom = y + height;

            switch (direction) {
                case 'top':
                    ctx.fillRect(0, 0, maskCanvas.width, y + overlap);
                    break;
                case 'bottom':
                    ctx.fillRect(0, bottom - overlap, maskCanvas.width, maskCanvas.height - (bottom - overlap));
                    break;
                case 'left':
                    ctx.fillRect(0, 0, x + overlap, maskCanvas.height);
                    break;
                case 'right':
                    ctx.fillRect(right - overlap, 0, maskCanvas.width - (right - overlap), maskCanvas.height);
                    break;
            }
        }
    
        return maskCanvas.toDataURL('image/png');
    }, [expansionImageDetails, targetSize, scaledFrameDims, originalImageRectInFrame, imagePosition, imageDisplaySize, isExpanded, expandSourceGeometry]);

    const handleExpand = useCallback(async (direction = 'all') => {
        const imageToProcessSrc = direction === 'all' ? expandSourceImage : currentBaseImage;
        if (isLoading || !imageToProcessSrc || !apiKey) return;
        
        setErrorMessage(null);

        const isInitialFullExpand = direction === 'all' && !isExpanded;
        if (isInitialFullExpand) {
            setExpandSourceGeometry({
                position: imagePosition,
                displaySize: imageDisplaySize,
            });
        }
        
        const isRegeneratingAll = direction === 'all' && isExpanded;
        const geometry = isRegeneratingAll ? expandSourceGeometry : { position: imagePosition, displaySize: imageDisplaySize };

        if (!geometry) {
            console.error("Expand failed: geometry is missing.");
            return;
        }
    
        setIsLoading(true);
        setLoadingMessage(direction === 'all' ? "Expanding canvas..." : "Regenerating section...");
        try {
            const ai = new GoogleGenAI({apiKey: apiKey});
            const maskImage = getMaskForExpansion(direction);
            if (!maskImage) throw new Error("Could not create mask.");
    
            let imageForApi;
    
            if (direction === 'all' && scaledFrameDims) {
                const img = await new Promise((resolve, reject) => {
                    const image = new Image();
                    image.onload = () => resolve(image);
                    image.onerror = (err) => reject(new Error("Image failed to load for expansion payload."));
                    image.src = imageToProcessSrc;
                });
    
                const inputCanvas = document.createElement('canvas');
                inputCanvas.width = targetSize.width;
                inputCanvas.height = targetSize.height;
                const ctx = inputCanvas.getContext('2d');
                if (!ctx) throw new Error("Could not get canvas context.");
                
                const scale = targetSize.width / scaledFrameDims.width;
                
                const ix = Math.round(geometry.position.x * scale);
                const iy = Math.round(geometry.position.y * scale);
                const iw = Math.round(geometry.displaySize.width * scale);
                const ih = Math.round(geometry.displaySize.height * scale);

                // 1. Draw the original image
                ctx.drawImage(img, ix, iy, iw, ih);

                // 2. Implement Edge Smearing to provide context for the AI
                ctx.imageSmoothingEnabled = true; // Use smoothing for a softer gradient context
                ctx.imageSmoothingQuality = 'high'; // Suggest high quality smoothing
                // Smear left edge
                if (ix > 0) {
                    ctx.drawImage(inputCanvas, ix, iy, 1, ih, 0, iy, ix, ih);
                }
                // Smear right edge
                if (ix + iw < targetSize.width) {
                    ctx.drawImage(inputCanvas, ix + iw - 1, iy, 1, ih, ix + iw, iy, targetSize.width - (ix + iw), ih);
                }
                // Smear top edge (covers full width, including smeared corners)
                if (iy > 0) {
                    ctx.drawImage(inputCanvas, 0, iy, targetSize.width, 1, 0, 0, targetSize.width, iy);
                }
                // Smear bottom edge (covers full width)
                if (iy + ih < targetSize.height) {
                    ctx.drawImage(inputCanvas, 0, iy + ih - 1, targetSize.width, 1, 0, iy + ih, targetSize.width, targetSize.height - (iy + ih));
                }
                
                imageForApi = inputCanvas.toDataURL('image/png');

            } else {
                imageForApi = imageToProcessSrc;
            }
    
            if (!imageForApi) {
                throw new Error("Could not prepare image for API.");
            }
    
            const imagePart = fileToGenerativePart(imageForApi);
            const maskPart = fileToGenerativePart(maskImage);
            
            const { englishPrompt: expandEnglishPrompt, instructions: expandInstructions } = prompts.Expand;
            let userPrompt = expandEnglishPrompt || expandInstructions;

            if (!userPrompt) {
                setLoadingMessage("Analyzing image for context...");
                try {
                    const analysisImagePart = fileToGenerativePart(imageToProcessSrc);
                    const analysisPrompt = `Briefly describe this image in a few English keywords for an AI image generator's outpainting prompt. Focus on the overall scene, environment, time of day, and style. Your description should be a direct continuation of what's visible. Example: 'a quiet sunlit street in a Japanese suburb, daytime, clear sky, realistic photo'.`;
                    
                    const analysisResponse = await ai.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents: { parts: [analysisImagePart, { text: analysisPrompt }] }
                    });
                    
                    userPrompt = analysisResponse.text.trim();
                    setPrompts(p => ({ ...p, Expand: { ...p.Expand, englishPrompt: userPrompt, instructions: '' } }));
                    setLoadingMessage(direction === 'all' ? "Expanding canvas..." : "Regenerating section...");
                } catch (analysisError) {
                    console.error("Image analysis for expansion failed:", analysisError);
                    // Proceed without a prompt as a fallback
                }
            }
            
            const finalUserPrompt = getKeywordEnhancedPrompt(userPrompt) || userPrompt;
            let prompt;

            if (direction === 'all') {
                const basePrompt = `**TASK: IMAGE OUTPAINTING**
**CRITICAL GOAL:** Extend the scene in the provided image to fill the entire canvas, creating a single, seamless, photorealistic result.
**INPUTS:**
1. An image containing a central subject placed on a larger canvas, with the empty space filled with placeholder 'smeared' pixels.
2. A mask where 'black' indicates the original, high-quality content that MUST be preserved, and 'white' indicates the area to be filled with new, generated content. The white area intentionally overlaps the edges of the original content.

**INSTRUCTIONS:**
1. **PRESERVE BLACK AREA:** The content within the black-masked area is the ground truth. It MUST NOT be changed, moved, or altered in any way.
2. **GENERATE & BLEND:** Generate new content ONLY in the white area. This new content must be a logical continuation of the original scene and blend seamlessly with it. You must completely replace the placeholder smeared pixels and the overlapped original image content with your new, high-quality generation.
3. **MAINTAIN STYLE:** The style, lighting, color grading, and perspective must remain consistent with the original image.
4. **NO TEXT/WATERMARKS:** The final output must be purely pictorial.
5. **FINAL DIMENSIONS:** The output image must be exactly ${targetSize.width}px by ${targetSize.height}px.`;
                if (finalUserPrompt) {
                    prompt = `${basePrompt}\n\n**USER REQUEST:** ${finalUserPrompt}`;
                } else {
                    prompt = basePrompt;
                }
            } else {
                const directionName = direction.replace('-', ' ');
                const basePrompt = `**TASK: IMAGE INPAINTING (SECTION REGENERATION)**
**CRITICAL GOAL:** Regenerate a specific section of a larger photograph seamlessly, based on user instructions.
**INPUTS:**
1. A complete photograph.
2. A mask where 'white' indicates the '${directionName}' section to be completely replaced, and 'black' indicates the finished parts of the photo that MUST be preserved. The white area intentionally overlaps the existing content to provide blending context.

**INSTRUCTIONS:**
1. **PRESERVE BLACK AREA:** The content in the black-masked area is finished and MUST NOT be changed in any way.
2. **REGENERATE WHITE AREA:** Generate new content in the white-masked area that is a logical and stylistic continuation of the rest of the image.
3. **SEAMLESS BLEND:** The new content must blend perfectly with the surrounding unmasked area, with no visible seams or borders.
4. **FINAL DIMENSIONS:** The output image must have the exact same dimensions as the input image.
5. **NO TEXT:** The output must be purely pictorial.`;
                if (finalUserPrompt) {
                    prompt = `${basePrompt}\n\n**USER REQUEST:** While regenerating, also incorporate this idea: "${finalUserPrompt}"`;
                } else {
                    prompt = basePrompt;
                }
            }
    
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [imagePart, maskPart, { text: prompt }] },
                config: { responseModalities: [Modality.IMAGE] },
            });
            const candidate = response.candidates?.[0];
            const expandedImageData = candidate?.content?.parts?.find(p => p.inlineData)?.inlineData;
    
            if (expandedImageData) {
                const imageUrl = `data:${expandedImageData.mimeType};base64,${expandedImageData.data}`;
    
                if (direction === 'all' && scaledFrameDims) {
                     const scale = targetSize.width / scaledFrameDims.width;
                     const rect = {
                         x: Math.round(geometry.position.x * scale),
                         y: Math.round(geometry.position.y * scale),
                         width: Math.round(geometry.displaySize.width * scale),
                         height: Math.round(geometry.displaySize.height * scale),
                     };
                     setOriginalImageRectInFrame(rect);

                     const zones = {};
                     const { x, y, width, height } = rect;
                     const right = x + width;
                     const bottom = y + height;
                     const PIXEL_TOLERANCE = 16;
                     
                     zones['top'] = y > PIXEL_TOLERANCE;
                     zones['left'] = x > PIXEL_TOLERANCE;
                     zones['right'] = (targetSize.width - right) > PIXEL_TOLERANCE;
                     zones['bottom'] = (targetSize.height - bottom) > PIXEL_TOLERANCE;
                     setRegenerateZones(zones);
                }
    
                updateActiveImage(imageUrl);
                setCurrentBaseImage(imageUrl);
                setSessionOriginalImage(imageUrl);
                setIsExpanded(true);
            } else {
                const finishReason = candidate?.finishReason;
                console.error("Expand failed. Reason:", finishReason);
                let userMessage = "Image expansion failed. Please try again.";
                if (finishReason === 'PROHIBITED_CONTENT' || finishReason === 'SAFETY') {
                    userMessage = "Expansion blocked by safety filters. Please adjust your prompt or image.";
                } else if (finishReason) {
                    userMessage = `Expansion failed. Reason: ${finishReason.replace(/_/g, ' ')}`;
                }
                setErrorMessage(userMessage);
            }
        } catch (e) {
            console.error("Image expansion error:", e);
            setErrorMessage("An unexpected error occurred during expansion.");
        } finally {
            setIsLoading(false);
        }
    }, [
        apiKey, isLoading, currentBaseImage, expandSourceImage, getMaskForExpansion, 
        prompts.Expand, targetSize, scaledFrameDims, imagePosition, imageDisplaySize, isExpanded, expandSourceGeometry
    ]);

    const handleRegenerate = useCallback(() => {
        handleExpand('all');
    }, [handleExpand]);
    
    useLayoutEffect(() => {
        if (activeMenu !== 'Expand' || !activeImage) {
            return;
        }
    
        const initExpansion = (img) => {
            const { naturalWidth, naturalHeight } = img;
            
            setExpansionImageDetails({
                src: activeImage,
                naturalWidth: naturalWidth,
                naturalHeight: naturalHeight,
            });
            
            if (isExpanded) {
                // When an expansion happens, activeImage is updated.
                // We just need to acknowledge its new dimensions for display,
                // but we must NOT change targetSize, as that defines the canvas we are working in.
            } else {
                setAspectRatio("16:9");
                const frameRatio = 16 / 9;
                const imageRatio = naturalWidth / naturalHeight;
    
                let newWidth, newHeight;
                if (frameRatio > imageRatio) {
                    newHeight = naturalHeight * 1.5;
                    newWidth = newHeight * frameRatio;
                } else {
                    newWidth = naturalWidth * 1.5;
                    newHeight = newWidth / frameRatio;
                }
    
                setTargetSize(clampTargetSize(newWidth, newHeight));
            }
        };
    
        const img = new Image();
        img.src = activeImage;
        img.onload = () => initExpansion(img);
        img.onerror = () => {
            console.error("Failed to load image for expansion details.");
            setExpansionImageDetails({ src: null, naturalWidth: 0, naturalHeight: 0 });
        };
    }, [activeImage, activeMenu, isExpanded]);
    
    useLayoutEffect(() => {
        const container = canvasContainerRef.current;
        if (activeMenu !== 'Expand' || !container || !targetSize.width || !targetSize.height || !expansionImageDetails.naturalWidth) {
            setScaledFrameDims(null);
            return;
        }
    
        const containerWidth = container.clientWidth - 16; 
        const containerHeight = container.clientHeight - 16;
    
        const scale = Math.min(
            containerWidth / targetSize.width,
            containerHeight / targetSize.height
        );
    
        const frameW = targetSize.width * scale;
        const frameH = targetSize.height * scale;
        
        setScaledFrameDims({ width: frameW, height: frameH });
    
        if (isExpanded) {
            setImageDisplaySize({ width: frameW, height: frameH });
            setImagePosition({ x: 0, y: 0 });
        } else {
            const imgW = expansionImageDetails.naturalWidth * scale;
            const imgH = expansionImageDetails.naturalHeight * scale;
            setImageDisplaySize({ width: imgW, height: imgH });
            setImagePosition({
                x: (frameW - imgW) / 2,
                y: (frameH - imgH) / 2,
            });
        }
    }, [activeMenu, targetSize, expansionImageDetails, isExpanded]);

    // This effect handles the initial centering of the expansion canvas
    useLayoutEffect(() => {
        const container = canvasContainerRef.current;
        if (activeMenu !== 'Expand' || !container || !scaledFrameDims) {
            setZoom(1);
            setPan({ x: 0, y: 0 });
            return;
        }

        const containerW = container.clientWidth;
        const containerH = container.clientHeight;
        const frameW = scaledFrameDims.width;
        const frameH = scaledFrameDims.height;
        
        const newZoom = Math.min(
            (containerW - 32) / frameW,
            (containerH - 32) / frameH,
        );

        const newPanX = (containerW - frameW * newZoom) / 2;
        const newPanY = (containerH - frameH * newZoom) / 2;

        setZoom(newZoom);
        setPan({ x: newPanX, y: newPanY });

    }, [activeMenu, scaledFrameDims]); 


    const handleAspectRatioChange = useCallback((newRatio) => {
        setAspectRatio(newRatio);
        
        if (activeMenu === 'Expand') {
            if (!expansionImageDetails.naturalWidth || !targetSize.width || !scaledFrameDims) return;
            const [w, h] = newRatio.split(':').map(s => parseInt(s, 10));
            const newFrameRatio = w / h;
            const scale = targetSize.width / scaledFrameDims.width;
            const imageWidth = imageDisplaySize.width * scale;
            const imageHeight = imageDisplaySize.height * scale;
            if (imageWidth === 0 || imageHeight === 0) return;
            const imageRatio = imageWidth / imageHeight;
            const widthPaddingFactor = targetSize.width / imageWidth;
            const heightPaddingFactor = targetSize.height / imageHeight;
            const paddingFactor = Math.max(widthPaddingFactor, heightPaddingFactor, 1.1);
            let finalWidth, finalHeight;
            if (newFrameRatio > imageRatio) {
                finalHeight = imageHeight * paddingFactor;
                finalWidth = finalHeight * newFrameRatio;
            } else {
                finalWidth = imageWidth * paddingFactor;
                finalHeight = finalWidth / newFrameRatio;
            }
            setTargetSize(clampTargetSize(finalWidth, finalHeight));
        }
    }, [activeMenu, expansionImageDetails, targetSize, scaledFrameDims, imageDisplaySize, setAspectRatio, setTargetSize]);

    const handleCustomSizeChange = useCallback((dimension, valueStr) => {
        const value = parseInt(valueStr, 10) || 0;
        const [ratioW, ratioH] = aspectRatio.split(':').map(s => parseInt(s, 10));
        const frameRatio = ratioW / ratioH;
    
        let newWidth, newHeight;
    
        if (dimension === 'width') {
            newWidth = value;
            newHeight = Math.round(value / frameRatio);
        } else {
            newHeight = value;
            newWidth = Math.round(value * frameRatio);
        }
        
        setTargetSize(clampTargetSize(newWidth, newHeight));
    }, [aspectRatio, setTargetSize]);

    const handleDragStart = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
        dragStartRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            initialX: imagePosition.x,
            initialY: imagePosition.y,
        };
    }, [imagePosition, setIsDragging]);
    
    const handleDragMove = useCallback((e) => {
        if (!isDragging || !scaledFrameDims) return;
        
        const dx = (e.clientX - dragStartRef.current.startX) / zoom;
        const dy = (e.clientY - dragStartRef.current.startY) / zoom;
        
        let newX = dragStartRef.current.initialX + dx;
        let newY = dragStartRef.current.initialY + dy;
    
        const { width: frameW, height: frameH } = scaledFrameDims;
        const { width: imgW, height: imgH } = imageDisplaySize;
        newX = Math.max(0, Math.min(newX, frameW - imgW));
        newY = Math.max(0, Math.min(newY, frameH - imgH));
    
        setImagePosition({ x: newX, y: newY });
    }, [isDragging, scaledFrameDims, imageDisplaySize, zoom, setImagePosition]);
    
    const handleDragEnd = useCallback(() => {
        setIsDragging(false);
    }, [setIsDragging]);

    // --- START OF RESIZE LOGIC REFACTOR ---

    const handleResizeStart = useCallback((e, handle) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing({ active: true, handle });
        resizeStartRef.current = {
            mouseX: e.clientX,
            mouseY: e.clientY,
            initialX: imagePosition.x,
            initialY: imagePosition.y,
            initialW: imageDisplaySize.width,
            initialH: imageDisplaySize.height,
            altKey: e.altKey,
        };
    }, [imagePosition, imageDisplaySize, setIsResizing]);

    const resizeMoveHandlerRef = useRef(null);

    const handleResizeMove = useCallback((e) => {
        if (!isResizing.active || !resizeStartRef.current || !scaledFrameDims) return;

        const { mouseX, mouseY, initialX, initialY, initialW, initialH, altKey } = resizeStartRef.current;
        const { handle } = isResizing;
        e.preventDefault();

        const dx = (e.clientX - mouseX) / zoom;
        const dy = (e.clientY - mouseY) / zoom;

        const imageAspectRatio = expansionImageDetails.naturalWidth / expansionImageDetails.naturalHeight;

        let dw;
        const dwFromDx = handle.includes('l') ? -dx : dx;
        const dhFromDy = handle.includes('t') ? -dy : dy;

        if (Math.abs(dx) > Math.abs(dy)) {
            dw = dwFromDx;
        } else {
            dw = dhFromDy * imageAspectRatio;
        }

        let newW, newH, newX, newY;

        if (altKey) {
            newW = initialW + dw * 2;
        } else {
            newW = initialW + dw;
        }
        newH = newW / imageAspectRatio;
        
        const { width: frameW, height: frameH } = scaledFrameDims;
        const minSize = 20;

        if (newW < minSize || newH < minSize) {
            if (newW < minSize) { newW = minSize; newH = newW / imageAspectRatio; }
            if (newH < minSize) { newH = minSize; newW = newH * imageAspectRatio; }
        }
        
        if (newW > frameW) { newW = frameW; newH = newW / imageAspectRatio; }
        if (newH > frameH) { newH = frameH; newW = newH * imageAspectRatio; }

        if (altKey) {
            newX = (initialX + initialW / 2) - newW / 2;
            newY = (initialY + initialH / 2) - newH / 2;
        } else {
            newX = handle.includes('l') ? (initialX + initialW) - newW : initialX;
            newY = handle.includes('t') ? (initialY + initialH) - newH : initialY;
        }

        newX = Math.max(0, Math.min(newX, frameW - newW));
        newY = Math.max(0, Math.min(newY, frameH - newH));

        setImageDisplaySize({ width: newW, height: newH });
        setImagePosition({ x: newX, y: newY });
    }, [isResizing, scaledFrameDims, zoom, expansionImageDetails.naturalWidth, expansionImageDetails.naturalHeight, setImageDisplaySize, setImagePosition]);

    useLayoutEffect(() => {
        resizeMoveHandlerRef.current = handleResizeMove;
    });

    const handleResizeEnd = useCallback(() => {
        setIsResizing({ active: false, handle: null });
    }, [setIsResizing]);

    useEffect(() => {
        if (isResizing.active) {
            const moveHandler = (e) => resizeMoveHandlerRef.current(e);
            const endHandler = () => handleResizeEnd();
    
            window.addEventListener('mousemove', moveHandler);
            window.addEventListener('mouseup', endHandler);
            window.addEventListener('mouseleave', endHandler);
    
            return () => {
                window.removeEventListener('mousemove', moveHandler);
                window.removeEventListener('mouseup', endHandler);
                window.removeEventListener('mouseleave', endHandler);
            };
        }
    }, [isResizing.active, handleResizeEnd]);

    // --- END OF RESIZE LOGIC REFACTOR ---


    // PAN AND ZOOM HANDLERS
    const handleCanvasWheel = useCallback((e) => {
        const container = canvasContainerRef.current;
        if (!container) return;
        e.preventDefault();
        
        const rect = container.getBoundingClientRect();
        const mousePoint = { x: e.clientX - rect.left, y: e.clientY - rect.top };

        if (activeMenu === 'Expand') {
            const zoomFactor = 1.1;
            const newZoom = e.deltaY < 0 ? zoom * zoomFactor : zoom / zoomFactor;
            const clampedZoom = Math.max(0.1, Math.min(10, newZoom));

            const newPanX = mousePoint.x - (mousePoint.x - pan.x) * (clampedZoom / zoom);
            const newPanY = mousePoint.y - (mousePoint.y - pan.y) * (clampedZoom / zoom);

            setZoom(clampedZoom);
            setPan({ x: newPanX, y: newPanY });
        } else if (activeImage && activeMenu !== 'CameraPosition') { // Generic zoom for other views
            const zoomFactor = 1.1;
            const newScale = e.deltaY < 0 ? viewTransform.scale * zoomFactor : viewTransform.scale / zoomFactor;
            const clampedScale = Math.max(0.25, Math.min(8, newScale));

            const newPanX = mousePoint.x - (mousePoint.x - viewTransform.pan.x) * (clampedScale / viewTransform.scale);
            const newPanY = mousePoint.y - (mousePoint.y - viewTransform.pan.y) * (clampedScale / viewTransform.scale);
            
            setViewTransform({ scale: clampedScale, pan: { x: newPanX, y: newPanY } });
        }
    }, [activeMenu, zoom, pan, setZoom, setPan, activeImage, viewTransform]);

    const handleCanvasPanMouseDown = useCallback((e) => {
        if (e.button !== 1) return; // Only middle mouse button
        e.preventDefault();

        if (activeMenu === 'Expand') {
            setIsPanning(true);
            panStartRef.current = {
                x: e.clientX - pan.x,
                y: e.clientY - pan.y
            };
            if (canvasContainerRef.current) canvasContainerRef.current.style.cursor = 'grabbing';
        } else if (activeImage && activeMenu !== 'CameraPosition') {
            setIsViewPanning(true);
            viewPanStartRef.current = {
                x: e.clientX - viewTransform.pan.x,
                y: e.clientY - viewTransform.pan.y
            };
            if (canvasContainerRef.current) canvasContainerRef.current.style.cursor = 'grabbing';
        }
    }, [activeMenu, pan, activeImage, viewTransform.pan]);

    const handleCanvasPanMouseMove = useCallback((e) => {
        if (activeMenu === 'Expand' || isViewPanning) {
            e.preventDefault();
        }

        if (isPanning) {
            setPan({
                x: e.clientX - panStartRef.current.x,
                y: e.clientY - panStartRef.current.y
            });
        } else if (isViewPanning) {
            setViewTransform(prev => ({
                ...prev,
                pan: {
                    x: e.clientX - viewPanStartRef.current.x,
                    y: e.clientY - viewPanStartRef.current.y
                }
            }));
        }
    }, [isPanning, isViewPanning, activeMenu, setPan, setViewTransform]);

    const handleCanvasPanMouseUp = useCallback(() => {
        if (isPanning) {
            setIsPanning(false);
            if (canvasContainerRef.current) canvasContainerRef.current.style.cursor = 'default';
        }
        if (isViewPanning) {
            setIsViewPanning(false);
            if (canvasContainerRef.current) canvasContainerRef.current.style.cursor = 'grab';
        }
    }, [isPanning, isViewPanning]);
    
    useEffect(() => {
        if (isPanning || isViewPanning) {
            window.addEventListener('mousemove', handleCanvasPanMouseMove);
            window.addEventListener('mouseup', handleCanvasPanMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleCanvasPanMouseMove);
                window.removeEventListener('mouseup', handleCanvasPanMouseUp);
            };
        }
    }, [isPanning, isViewPanning, handleCanvasPanMouseMove, handleCanvasPanMouseUp]);

    useEffect(() => {
      if (isDragging) {
        window.addEventListener('mousemove', handleDragMove);
        window.addEventListener('mouseup', handleDragEnd);
      }
      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
      };
    }, [isDragging, handleDragMove, handleDragEnd]);


    const handleGeneratePose = useCallback(async () => {
        if (!apiKey) {
            setErrorMessage("API Key is not available.");
            return;
        }
        const { englishPrompt: poseEnglishPrompt, instructions: poseInstructions } = prompts.Pose;
        const userInstructions = poseEnglishPrompt || poseInstructions;
    
        const ai = new GoogleGenAI({apiKey: apiKey});
        
        setErrorMessage(null);
    
        // --- REGENERATION LOGIC ---
        if (activeImage) {
            if (isLoading) return;
            if (!userInstructions || userInstructions.trim() === '') {
                 console.log("No new instructions for regeneration.");
                 return;
            }
    
            setIsLoading(true);
            setLoadingMessage("Updating scene...");
            try {
                const imageToEditPart = fileToGenerativePart(activeImage);
    
                setLoadingMessage("Isolating character...");
                const segmentationPrompt = `**TASK: Create a clean character silhouette mask.**
    **INPUT:** An image of a character.
    **GOAL:** Generate a pure black-and-white mask image.
    **CRITICAL RULES:**
    1.  **White for Character:** The character(s) and anything they are holding MUST be solid white.
    2.  **Black for Background:** The entire background MUST be solid black.
    3.  **No Grayscale:** There should be no gray, anti-aliasing, or soft edges. The mask must be perfectly clean.
    4.  **No Text.**`;
    
                const segmentationResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: { parts: [imageToEditPart, { text: segmentationPrompt }] },
                    config: { responseModalities: [Modality.IMAGE] },
                });
                
                const segCandidate = segmentationResponse.candidates?.[0];
                const maskData = segCandidate?.content?.parts.find(p => p.inlineData)?.inlineData;
                if (!maskData) {
                    const finishReason = segCandidate?.finishReason;
                    let userMessage = "Failed to create character mask for background change.";
                     if (finishReason === 'PROHIBITED_CONTENT' || finishReason === 'SAFETY') {
                        userMessage = "Mask creation blocked by safety filters. The image may be too complex.";
                    }
                    setErrorMessage(userMessage);
                    setIsLoading(false);
                    return;
                }
    
                const maskImageUrl = `data:${maskData.mimeType};base64,${maskData.data}`;
                const maskPart = fileToGenerativePart(maskImageUrl);
                
                setLoadingMessage("Generating new background...");
                const regenerationPrompt = `**TASK: Background Replacement**
    **INPUTS:**
    1.  **Original Image:** Contains a character whose pose, appearance, and position are final.
    2.  **Mask:** A black-and-white mask where 'white' indicates the character to be preserved, and 'black' indicates the background to be replaced.
    
    **GOAL:**
    Replace the background of the Original Image according to the user's request, while keeping the character perfectly unchanged.
    
    **CRITICAL RULES:**
    1.  **PRESERVE WHITE AREA:** The content in the white-masked area (the character) is perfect and MUST NOT be changed, moved, altered, or re-rendered in any way.
    2.  **REGENERATE BLACK AREA:** Generate a new background ONLY in the black-masked area.
    3.  **USER REQUEST:** The new background MUST be: "${userInstructions}".
    4.  **SEAMLESS BLEND:** The new background must blend perfectly with the character, with consistent lighting and shadows that make the character look natural in the new environment.
    5.  **NO TEXT/WATERMARKS.**`;
    
                const finalResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: { parts: [imageToEditPart, maskPart, { text: regenerationPrompt }] },
                    config: { responseModalities: [Modality.IMAGE] },
                });
    
                const finalCandidate = finalResponse.candidates?.[0];
                const generatedImageData = finalCandidate?.content?.parts.find(p => p.inlineData)?.inlineData;
                if (generatedImageData) {
                    const imageUrl = `data:${generatedImageData.mimeType};base64,${generatedImageData.data}`;
                    updateActiveImage(imageUrl);
                    setCurrentBaseImage(imageUrl);
                } else {
                    const finishReason = finalCandidate?.finishReason;
                    console.error("Regeneration failed. Reason:", finishReason);
                    let userMessage = "Image regeneration failed. Please try again.";
                    if (finishReason === 'PROHIBITED_CONTENT' || finishReason === 'SAFETY') {
                        userMessage = "Regeneration blocked by safety filters. Please adjust your prompt.";
                    } else if (finishReason) {
                        userMessage = `Regeneration failed. Reason: ${finishReason.replace(/_/g, ' ')}`;
                    }
                    setErrorMessage(userMessage);
                }
    
            } catch (e) {
                console.error("Image regeneration error:", e);
                setErrorMessage("An unexpected error occurred during regeneration.");
            } finally {
                setIsLoading(false);
            }
            return;
        }
    
        // --- INITIAL GENERATION LOGIC ---
        if (isLoading || !sourceImage || !poseReferenceImage) return;
        setIsLoading(true);
        setActiveImage(null);
        setCurrentBaseImage(null);
        setSessionOriginalImage(null);
    
        if (poseEnglishPrompt === "Translation failed.") {
            setPrompts(p => ({ ...p, Pose: { ...p.Pose, englishPrompt: '' } }));
        }
    
        try {
            // --- STEP 1: Extract Pose Outline ---
            setLoadingMessage("Analyzing pose...");
            const poseReferenceImagePart = fileToGenerativePart(poseReferenceImage);
            const poseExtractionPrompt = `**TASK: Extract a clean pose line art.**
    **INPUT:** An image of a person.
    **GOAL:** Generate a simple, clean, black line drawing of the subject's skeletal pose on a pure white background.
    **CRITICAL RULES:**
    1.  **Black Lines on White:** The output MUST be only black lines on a white background. No color, no shading, no gray.
    2.  **Focus on Skeleton/Structure:** Capture the line of action, joint positions, and limb angles. Ignore all details like face, clothing, and texture.
    3.  **No Background:** The original background must be completely removed.
    4.  **No Text.**
    The result should look like a skeletal reference drawing for an animator or a very simple stick figure representing the core pose.`;
    
            const poseExtractionResponse = await ai.models.generateContent({
                model: "gemini-2.5-flash-image",
                contents: { parts: [poseReferenceImagePart, { text: poseExtractionPrompt }] },
                config: { responseModalities: [Modality.IMAGE] },
            });
    
            const poseCandidate = poseExtractionResponse.candidates?.[0];
            const extractedPoseData = poseCandidate?.content?.parts.find(p => p.inlineData)?.inlineData;
            if (!extractedPoseData) {
                const finishReason = poseCandidate?.finishReason;
                let userMessage = "Failed to extract pose from reference image.";
                if (finishReason === 'PROHIBITED_CONTENT' || finishReason === 'SAFETY') {
                    userMessage = "Pose extraction blocked by safety filters. Please use a different pose image.";
                }
                setErrorMessage(userMessage);
                setIsLoading(false);
                return;
            }
            const extractedPoseImageUrl = `data:${extractedPoseData.mimeType};base64,${extractedPoseData.data}`;
            const extractedPosePart = fileToGenerativePart(extractedPoseImageUrl);
    
            // --- STEP 2: Generate Final Image ---
            setLoadingMessage("Generating final image...");
            const sourceImagePart = fileToGenerativePart(sourceImage);
            
            let finalGenerationPrompt = `**TASK: Re-pose a character using a line art reference.**
    **INPUTS:**
    1.  **Source Character Image:** Contains the character to be drawn. Use this for their face, clothing, art style, and texture.
    2.  **Pose Line Art Image:** A black-and-white line drawing defining the target pose.
    
    **GOAL (HIGHEST PRIORITY):** Redraw the character from the Source Image, fitting them perfectly to the pose defined by the Pose Line Art. The pose is the most important instruction.
    
    **CRITICAL RULES:**
    1.  **POSE IS PARAMOUNT:** The final character's pose MUST perfectly and exactly match the provided Pose Line Art. The position of the head, torso, limbs, and joints must align with the line art. Ignore the pose from the original Source Character Image completely.
    2.  **PRESERVE CHARACTER IDENTITY:** The final character MUST look identical to the one in the Source Image (face, hair, clothing details, art style, textures). Do not change the character.
    3.  **BACKGROUND LOGIC:**
        - **IF a user request specifies a background, generate that new background.**
        - **OTHERWISE, you MUST recreate the background from the Source Character Image.** Place the newly posed character into that original background seamlessly.
    4.  **SEAMLESS INTEGRATION:** The newly posed character must look natural in the chosen background, with consistent lighting and shadows.`;
        
            if (userInstructions) {
                finalGenerationPrompt += `\n\n**USER REQUEST:** ${userInstructions}`;
            }
    
            const finalResponse = await ai.models.generateContent({
                model: "gemini-2.5-flash-image",
                contents: { parts: [sourceImagePart, extractedPosePart, { text: finalGenerationPrompt }] },
                config: { responseModalities: [Modality.IMAGE] },
            });
    
            const finalGenCandidate = finalResponse.candidates?.[0];
            const generatedImageData = finalGenCandidate?.content?.parts.find(p => p.inlineData)?.inlineData;
            if (generatedImageData) {
                const imageUrl = `data:${generatedImageData.mimeType};base64,${generatedImageData.data}`;
                updateActiveImage(imageUrl);
                setCurrentBaseImage(imageUrl);
                setSessionOriginalImage(imageUrl);
            } else {
                const finishReason = finalGenCandidate?.finishReason;
                console.error("Initial generation failed. Reason:", finishReason);
                let userMessage = "Image generation failed. Please try again.";
                if (finishReason === 'PROHIBITED_CONTENT' || finishReason === 'SAFETY') {
                    userMessage = "Generation blocked by safety filters. Please adjust your prompt or images.";
                } else if (finishReason) {
                    userMessage = `Generation failed. Reason: ${finishReason.replace(/_/g, ' ')}`;
                }
                setErrorMessage(userMessage);
            }
    
        } catch (e) {
            console.error("Image generation error:", e);
            setErrorMessage("An unexpected error occurred during generation.");
        } finally {
            setIsLoading(false);
        }
    }, [apiKey, isLoading, sourceImage, poseReferenceImage, activeImage, prompts.Pose]);

    const handleApplyEdit = useCallback(async () => {
        if (isLoading || !currentBaseImage || !apiKey) return;
        
        setErrorMessage(null);
        setIsLoading(true);
        setLoadingMessage("Applying edits...");
        try {
            const ai = new GoogleGenAI({apiKey: apiKey});
            const maskImage = canvasRef.current.getMask();
            if(!maskImage) throw new Error("Could not get mask from canvas.");

            const originalImagePart = fileToGenerativePart(currentBaseImage);
            const maskImagePart = fileToGenerativePart(maskImage);
            const hasDrawing = canvasRef.current.hasDrawing();
            const { englishPrompt: editorEnglishPrompt, instructions: editorInstructions } = prompts.Editor;
            const textInstruction = editorEnglishPrompt || editorInstructions;
            const keywordPrompt = getKeywordEnhancedPrompt(textInstruction);

            let editPromptText;
            if (keywordPrompt) {
                editPromptText = keywordPrompt;
                if (hasDrawing) {
                    editPromptText += ' The edit should be constrained to the white area of the mask.';
                }
            } else {
                editPromptText = textInstruction ? `Perform the following edit: "${textInstruction}".` : `Apply the following lighting adjustments.`;
                editPromptText += hasDrawing ? ' The edit should be constrained to the white area of the mask.' : ' The edit applies to the entire image.';

                if (lighting.autoLight) {
                    editPromptText += ` Apply automatic lighting to enhance the scene naturally.`;
                } else {
                     editPromptText += ` Adjust the lighting with an intensity of ${lighting.intensity}% and a color temperature of ${lighting.temp}K.`;
                     if(lighting.direction) {
                         editPromptText += ` The primary light source should come from the ${lighting.direction.replace('-', ' ')}.`;
                     }
                }
                if (lighting.canvasLighting) {
                     editPromptText += ` Use dramatic, high-contrast lighting as if in a professional photo studio.`;
                }
            }

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [originalImagePart, maskImagePart, { text: editPromptText }] },
                config: { responseModalities: [Modality.IMAGE] },
            });

            const candidate = response.candidates?.[0];
            const editedImageData = candidate?.content?.parts.find(p => p.inlineData)?.inlineData;
            if (editedImageData) {
                const imageUrl = `data:${editedImageData.mimeType};base64,${editedImageData.data}`;
                updateActiveImage(imageUrl);
                setCurrentBaseImage(imageUrl);
                canvasRef.current.reset();
            } else {
                const finishReason = candidate?.finishReason;
                console.error("Edit failed. Reason:", finishReason);
                let userMessage = "Failed to apply edits. Please try again.";
                if (finishReason === 'PROHIBITED_CONTENT' || finishReason === 'SAFETY') {
                    userMessage = "Edit blocked by safety filters. Please adjust your prompt.";
                } else if (finishReason) {
                    userMessage = `Edit failed. Reason: ${finishReason.replace(/_/g, ' ')}`;
                }
                setErrorMessage(userMessage);
            }
        } catch (e) {
            console.error("Image editing error:", e);
            setErrorMessage("An unexpected error occurred during editing.");
        } finally {
            setIsLoading(false);
        }
    }, [apiKey, isLoading, currentBaseImage, prompts.Editor, lighting]);

    // --- START: Camera Position Logic ---
    useLayoutEffect(() => {
        const container = canvasContainerRef.current;
        const currentImageSrc = croppedImage || reframedImage || cameraPositionOriginal.src;
        const imageToMeasure = croppedImage || reframedImage || (cameraPositionOriginal.src && activeImage === cameraPositionOriginal.src ? activeImage : null) || cameraPositionOriginal.src;

        if (activeMenu !== 'CameraPosition' || !container || !imageToMeasure) {
            setImageDisplayBounds({ x: 0, y: 0, width: 0, height: 0 });
            return;
        }

        const img = new Image();
        img.onload = () => {
            const { naturalWidth, naturalHeight } = img;
            if (naturalWidth === 0 || naturalHeight === 0) return;

            const containerRect = container.getBoundingClientRect();
            const PADDING = 16;
            const availableWidth = containerRect.width - PADDING;
            const availableHeight = containerRect.height - PADDING;

            const scale = Math.min(availableWidth / naturalWidth, availableHeight / naturalHeight);
            const displayWidth = naturalWidth * scale;
            const displayHeight = naturalHeight * scale;
            const displayX = (containerRect.width - displayWidth) / 2;
            const displayY = (containerRect.height - displayHeight) / 2;

            setImageDisplayBounds({ x: displayX, y: displayY, width: displayWidth, height: displayHeight });

            if (!reframedImage) {
                 const [ratioW, ratioH] = aspectRatio.split(':').map(s => parseInt(s, 10));
                 const frameAspectRatio = ratioW / ratioH;
                
                let frameWidth, frameHeight;
                const PADDING_FACTOR = 1.0;
                
                if ((croppedImage && activeImage === croppedImage) || (!croppedImage && !reframedImage)) {
                    // This logic runs for the initial image and after a crop.
                    const paddedWidth = displayWidth * PADDING_FACTOR;
                    const paddedHeight = displayHeight * PADDING_FACTOR;
                    const paddedAspectRatio = paddedWidth / paddedHeight;
        
                    if (frameAspectRatio > paddedAspectRatio) {
                        frameWidth = paddedWidth;
                        frameHeight = frameWidth / frameAspectRatio;
                    } else {
                        frameHeight = paddedHeight;
                        frameWidth = frameHeight * frameAspectRatio;
                    }
                } else {
                    // Default case if something is off, just make it a bit smaller than the view
                    frameWidth = displayWidth * PADDING_FACTOR;
                    frameHeight = frameWidth / frameAspectRatio;
                }

                const frameX = (displayWidth - frameWidth) / 2;
                const frameY = (displayHeight - frameHeight) / 2;
                
                setCameraFrameRect({ x: frameX, y: frameY, width: frameWidth, height: frameHeight });
            }
        };
        img.src = imageToMeasure;

    }, [activeMenu, cameraPositionOriginal.src, activeImage, croppedImage, reframedImage, aspectRatio]);

    const handleFrameMouseDown = useCallback((e, handle) => {
        e.preventDefault();
        e.stopPropagation();
        const containerRect = canvasContainerRef.current.getBoundingClientRect();
        const startMouseX = e.clientX - containerRect.left;
        const startMouseY = e.clientY - containerRect.top;

        frameInteractionStartRef.current = {
            startX: startMouseX,
            startY: startMouseY,
            initialRect: { ...cameraFrameRect },
        };

        if (handle) {
            setIsResizingFrame({ active: true, handle });
        } else {
            setIsDraggingFrame(true);
        }
    }, [cameraFrameRect]);

    const handleFrameMouseMove = useCallback((e) => {
        if (!isDraggingFrame && !isResizingFrame.active) return;
        if (!frameInteractionStartRef.current || !imageDisplayBounds.width) return;
        e.preventDefault();
        e.stopPropagation();

        const { startX, startY, initialRect } = frameInteractionStartRef.current;
        const containerRect = canvasContainerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - containerRect.left;
        const mouseY = e.clientY - containerRect.top;
        const dx = (mouseX - startX);
        const dy = (mouseY - startY);

        if (isDraggingFrame) {
            let newX = initialRect.x + dx;
            let newY = initialRect.y + dy;

            newX = Math.max(0, Math.min(newX, imageDisplayBounds.width - initialRect.width));
            newY = Math.max(0, Math.min(newY, imageDisplayBounds.height - initialRect.height));

            setCameraFrameRect(prev => ({ ...prev, x: newX, y: newY }));
        } else { // Resizing
            const { handle } = isResizingFrame;
            let { x, y, width, height } = initialRect;
            const [ratioW, ratioH] = aspectRatio.split(':').map(s => parseInt(s, 10));
            const frameAspectRatio = ratioW / ratioH;
            
            let newWidth = width, newHeight = height, newX = x, newY = y;

            if (handle.includes('r')) newWidth = width + dx;
            if (handle.includes('l')) newWidth = width - dx;
            if (handle.includes('b')) newHeight = height + dy;
            if (handle.includes('t')) newHeight = height - dy;
            
            if (newWidth / frameAspectRatio > newHeight) {
                newHeight = newWidth / frameAspectRatio;
            } else {
                newWidth = newHeight * frameAspectRatio;
            }

            const dw = newWidth - width;
            const dh = newHeight - height;

            if (handle.includes('l')) newX = x - dw;
            if (handle.includes('t')) newY = y - dh;

            // Clamp size and position
            const minSize = 20;
            if (newWidth < minSize) { newWidth = minSize; newHeight = newWidth / frameAspectRatio; }
            if (newHeight < minSize) { newHeight = minSize; newWidth = newHeight * frameAspectRatio; }
            if (newX < 0) { newWidth += newX; newX = 0; newHeight = newWidth / frameAspectRatio; }
            if (newY < 0) { newHeight += newY; newY = 0; newWidth = newHeight * frameAspectRatio; }
            if (newX + newWidth > imageDisplayBounds.width) { newWidth = imageDisplayBounds.width - newX; newHeight = newWidth / frameAspectRatio; }
            if (newY + newHeight > imageDisplayBounds.height) { newHeight = imageDisplayBounds.height - newY; newWidth = newHeight * frameAspectRatio; }

            setCameraFrameRect({ x: newX, y: newY, width: newWidth, height: newHeight });
        }
    }, [isDraggingFrame, isResizingFrame, imageDisplayBounds, aspectRatio]);

    const handleFrameMouseUp = useCallback(() => {
        setIsDraggingFrame(false);
        setIsResizingFrame({ active: false, handle: null });
        frameInteractionStartRef.current = null;
    }, []);

    useEffect(() => {
        if (isDraggingFrame || isResizingFrame.active) {
            window.addEventListener('mousemove', handleFrameMouseMove);
            window.addEventListener('mouseup', handleFrameMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleFrameMouseMove);
            window.removeEventListener('mouseup', handleFrameMouseUp);
        };
    }, [isDraggingFrame, isResizingFrame.active, handleFrameMouseMove, handleFrameMouseUp]);

    const handleCropImage = useCallback(async () => {
        const imageToCrop = croppedImage || cameraPositionOriginal.src;
        if (!imageToCrop || !imageDisplayBounds.width || !cameraFrameRect.width) return;
        setErrorMessage(null);
        setIsLoading(true);
        setLoadingMessage("Cropping image...");
        setReframedImage(null);

        try {
            const originalImage = await new Promise((resolve, reject) => {
                const image = new Image();
                image.crossOrigin = "anonymous";
                image.onload = () => resolve(image);
                image.onerror = () => reject(new Error("Original image failed to load."));
                image.src = imageToCrop;
            });

            const { naturalWidth } = originalImage;
            const scaleFactor = naturalWidth / imageDisplayBounds.width;

            const sx = cameraFrameRect.x * scaleFactor;
            const sy = cameraFrameRect.y * scaleFactor;
            const sWidth = cameraFrameRect.width * scaleFactor;
            const sHeight = cameraFrameRect.height * scaleFactor;

            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = sWidth;
            finalCanvas.height = sHeight;
            const finalCtx = finalCanvas.getContext('2d');
            if (!finalCtx) throw new Error("Could not get canvas context.");

            finalCtx.drawImage(
                originalImage,
                sx, sy, sWidth, sHeight,
                0, 0, sWidth, sHeight
            );

            const croppedImageUrl = finalCanvas.toDataURL('image/png');
            setCroppedImage(croppedImageUrl);
            // After cropping, we need to update the active image for the next step
            updateActiveImage(croppedImageUrl);
            setCurrentBaseImage(croppedImageUrl);

        } catch (e) {
            console.error("Error during image cropping:", e);
            setErrorMessage("An error occurred while cropping the image.");
        } finally {
            setIsLoading(false);
        }
    }, [activeImage, croppedImage, cameraPositionOriginal.src, imageDisplayBounds, cameraFrameRect]);

    const handleEnhanceImage = useCallback(async () => {
        if (!croppedImage || !apiKey) return;
        setErrorMessage(null);
        setIsLoading(true);
        setLoadingMessage("화질 개선 및 업스케일링 중...");

        try {
            const ai = new GoogleGenAI({apiKey: apiKey});
            const croppedImg = await new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error("Could not load cropped image."));
                img.src = croppedImage;
            });
            
            const calculateUpscaleSize = (width, height) => {
                const minLongestSide = 1920;
                const targetLongestSide = 3840;
                
                if (width === 0 || height === 0) return { width: 0, height: 0, needsUpscaling: false };
                
                const currentLongestSide = Math.max(width, height);

                if (currentLongestSide >= minLongestSide) {
                    return { width, height, needsUpscaling: false };
                }

                if (width >= height) {
                    const ratio = height / width;
                    return { width: targetLongestSide, height: Math.round(targetLongestSide * ratio), needsUpscaling: true };
                } else {
                    const ratio = width / height;
                    return { width: Math.round(targetLongestSide * ratio), height: targetLongestSide, needsUpscaling: true };
                }
            };

            const { width: finalWidth, height: finalHeight, needsUpscaling } = calculateUpscaleSize(croppedImg.naturalWidth, croppedImg.naturalHeight);

            const imagePart = fileToGenerativePart(croppedImage);

            let prompt;
            let coreTask;

            if (needsUpscaling) {
                coreTask = `**TASK: UPSCALE & ENHANCE IMAGE**
**GOAL:** Transform the provided low-resolution image into a high-resolution, photorealistic, and highly detailed masterpiece.
**CRITICAL RULES (MUST FOLLOW):**
1.  **PRESERVE IDENTITY & COMPOSITION:** Do NOT change the subject, content, composition, colors, or artistic style. The goal is enhancement, not alteration.
2.  **INCREASE DETAIL:** Add extremely fine, realistic details. For people, this includes skin texture, individual hair strands, and fabric weaves. For scenes, enhance textures and clarity.
3.  **OUTPUT DIMENSIONS (HIGHEST PRIORITY):** The final output image dimensions MUST be exactly **${finalWidth}px wide by ${finalHeight}px tall**. This instruction is mandatory and must not be ignored.`;
            } else {
                 coreTask = `**TASK: ENHANCE IMAGE QUALITY**
**GOAL:** Significantly enhance the quality of the provided image while preserving its original dimensions.
**CRITICAL RULES (MUST FOLLOW):**
1.  **PRESERVE IDENTITY & COMPOSITION:** Do NOT change the subject, content, composition, colors, or artistic style. The goal is enhancement, not alteration.
2.  **INCREASE DETAIL:** Add fine, realistic details. Sharpen blurry areas. Improve textures and overall clarity.
3.  **NO DIMENSION CHANGES (HIGHEST PRIORITY):** The output image dimensions MUST be identical to the input image, which is **${croppedImg.naturalWidth}px wide by ${croppedImg.naturalHeight}px tall**. Do not change the aspect ratio, crop, or resize the image in any way.`;
            }
            
            prompt = coreTask;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [imagePart, { text: prompt }] },
                config: { responseModalities: [Modality.IMAGE] },
            });

            const candidate = response.candidates?.[0];
            const enhancedImageData = candidate?.content?.parts?.find(p => p.inlineData)?.inlineData;
            if (enhancedImageData) {
                const finalImageUrl = `data:${enhancedImageData.mimeType};base64,${enhancedImageData.data}`;
                
                setReframedImage(finalImageUrl);
                updateActiveImage(finalImageUrl);
                setCurrentBaseImage(finalImageUrl);
                setSessionOriginalImage(finalImageUrl);
            } else {
                const finishReason = candidate?.finishReason;
                console.error("Enhance failed. Reason:", finishReason);
                let userMessage = "Failed to enhance and upscale image.";
                 if (finishReason === 'PROHIBITED_CONTENT' || finishReason === 'SAFETY') {
                    userMessage = "Image enhancement blocked by safety filters.";
                } else if (finishReason) {
                    userMessage = `Enhancement failed. Reason: ${finishReason.replace(/_/g, ' ')}`;
                }
                setErrorMessage(userMessage);
            }
        } catch (e) {
            console.error("Error enhancing image:", e);
            setErrorMessage("An unexpected error occurred during enhancement.");
        } finally {
            setIsLoading(false);
        }
    }, [apiKey, croppedImage]);
    
    const handleResetCameraPosition = useCallback(() => {
        if (cameraPositionOriginal.src) {
            setActiveImage(cameraPositionOriginal.src);
            setCurrentBaseImage(cameraPositionOriginal.src);
            setSessionOriginalImage(cameraPositionOriginal.src);
            setImageHistory([cameraPositionOriginal.src]);
        }
        setCroppedImage(null);
        setReframedImage(null);
        setAspectRatio("16:9");
        setPrompts(p => ({ ...p, CameraPosition: { ...initialPromptState } }));
        setErrorMessage(null);
    }, [cameraPositionOriginal]);

    const handleNewCameraImage = useCallback(() => {
        setActiveImage(null);
        setCurrentBaseImage(null);
        setSessionOriginalImage(null);
        setImageHistory([]);
        setCameraPositionOriginal({ src: null, naturalWidth: 0, naturalHeight: 0 });
        setCroppedImage(null);
        setReframedImage(null);
        setAspectRatio("16:9");
        setPrompts(p => ({ ...p, CameraPosition: { ...initialPromptState } }));
        setErrorMessage(null);
    }, []);
    // --- END: Camera Position Logic ---

    // --- START: Map Marker Logic ---
    const handleMapMouseDown = useCallback((e) => {
        if (!displayedImageGeom) return;
        e.preventDefault();
        setIsPlacingMarker(true);
        setHoverMarkerPos(null); // Hide preview while placing

        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / viewTransform.scale;
        const y = (e.clientY - rect.top) / viewTransform.scale;
        setMapMarker({ x, y, rotation: 0 }); // Set initial marker position
    }, [displayedImageGeom, viewTransform.scale]);

    const handleMapMouseMove = useCallback((e) => {
        if (!displayedImageGeom) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / viewTransform.scale;
        const y = (e.clientY - rect.top) / viewTransform.scale;

        if (isPlacingMarker && mapMarker) {
            // If placing, update rotation based on drag
            const deltaX = x - mapMarker.x;
            const deltaY = y - mapMarker.y;
            const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
            setMapMarker(prev => ({ ...prev, rotation: angle + 90 }));
        } else if (!isPlacingMarker) {
            // If just hovering, update preview position
            setHoverMarkerPos({ x, y });
        }
    }, [displayedImageGeom, isPlacingMarker, mapMarker, viewTransform.scale]);

    const handleMapMouseUp = useCallback(() => {
        setIsPlacingMarker(false);
    }, []);

    const handleMapMouseLeave = useCallback(() => {
        setHoverMarkerPos(null);
        if (isPlacingMarker) {
            setIsPlacingMarker(false);
        }
    }, [isPlacingMarker]);
    // --- END: Map Marker Logic ---


    // --- START: Style Menu Logic ---
    const handleTransportSourceImageChange = useCallback((newImage) => {
        setTransportSourceImage(newImage);
        if (!newImage) {
            setSelectedVehicleType('');
            setSelectedCameraAngle('');
        }
    }, []);

    const handleGenerateStyle = useCallback(async (promptOverride = null) => {
        if (isLoading || !apiKey) return;
        
        setErrorMessage(null);

        if (selectedStyle === 'upscale' && activeImage) {
            setStyleComparisonOriginal(activeImage);
        }

        const ai = new GoogleGenAI({apiKey: apiKey});

        try {
            if (selectedStyle === 'product-mockup') {
                if (!productMockupObjectImage || !productMockupDesignImage) return;
                setIsLoading(true);
                setLoadingMessage("Generating mockup...");
                setActiveImage(null);
                const objectPart = fileToGenerativePart(productMockupObjectImage);
                const designPart = fileToGenerativePart(productMockupDesignImage);
                
                const { instructions: styleInstructions } = prompts.Style;
        
                let backgroundInstruction = '';
                if (styleInstructions && styleInstructions.trim()) {
                    backgroundInstruction = `Place the final mockup in the following setting, ensuring it is photorealistic with professional lighting: "${styleInstructions}"`;
                } else {
                    backgroundInstruction = "Place the final mockup on a solid chroma key green (#00ff00) background. The lighting on the object should still be professional and realistic, casting a subtle shadow on the green surface.";
                }
        
                const prompt = `**TASK: Product Mockup Generation**
**INPUTS:**
1. **Object Image:** An image of the product to apply the design to (e.g., a blank can, t-shirt, box).
2. **Design Image:** An image of the label, artwork, or texture to be applied.

**GOAL:**
Create a photorealistic mockup by seamlessly applying the design from the Design Image onto the surface of the object in the Object Image.

**CRITICAL RULES:**
1. **PRESERVE OBJECT SHAPE:** The shape, lighting, shadows, and perspective of the object from the Object Image must be perfectly maintained.
2. **APPLY DESIGN:** The design from the Design Image must be realistically wrapped onto the object's surface, conforming to its curves, contours, and texture.
3. **BACKGROUND:** ${backgroundInstruction}
4. **PHOTOREALISM:** The final image must look like a professional product photograph.`;
        
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: { parts: [objectPart, designPart, { text: prompt }] },
                    config: { responseModalities: [Modality.IMAGE] },
                });
        
                const candidate = response.candidates?.[0];
                const generatedImageData = candidate?.content?.parts?.find(p => p.inlineData)?.inlineData;
                if (generatedImageData) {
                    const imageUrl = `data:${generatedImageData.mimeType};base64,${generatedImageData.data}`;
                    updateActiveImage(imageUrl);
                    setCurrentBaseImage(imageUrl);
                    setSessionOriginalImage(imageUrl);
                } else {
                    const finishReason = candidate?.finishReason;
                    console.error("Product mockup failed. Reason:", finishReason);
                    let userMessage = "Product mockup generation failed. Please try again.";
                    if (finishReason === 'PROHIBITED_CONTENT' || finishReason === 'SAFETY') {
                        userMessage = "Mockup generation blocked by safety filters. Please use different images.";
                    } else if (finishReason) {
                        userMessage = `Mockup failed. Reason: ${finishReason.replace(/_/g, ' ')}`;
                    }
                    setErrorMessage(userMessage);
                }
                return; 
            }

            if (selectedStyle === 'clothing-swap') {
                if (!clothingSwapSourceImage || !clothingSwapReferenceImage) return;
                setIsLoading(true);
                setLoadingMessage("Applying new clothing...");
                setActiveImage(null);
                const sourcePart = fileToGenerativePart(clothingSwapSourceImage);
                const clothingPart = fileToGenerativePart(clothingSwapReferenceImage);
                const prompt = "Replace the person's clothing in the first input image with the target clothing shown in the second reference image. Keep the person's pose, facial expression, background, and overall realism unchanged. Make the new outfit look natural, well-fitted, and consistent with lighting and shadows. Do not alter the person's identity or the environment — only change the clothes.";

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: { parts: [sourcePart, clothingPart, { text: prompt }] },
                    config: { responseModalities: [Modality.IMAGE] },
                });

                const candidate = response.candidates?.[0];
                const generatedImageData = candidate?.content?.parts?.find(p => p.inlineData)?.inlineData;
                if (generatedImageData) {
                    const imageUrl = `data:${generatedImageData.mimeType};base64,${generatedImageData.data}`;
                    updateActiveImage(imageUrl);
                    setCurrentBaseImage(imageUrl);
                    setSessionOriginalImage(imageUrl);
                } else {
                    const finishReason = candidate?.finishReason;
                    let userMessage = "Clothing swap failed. Please try again.";
                    if (finishReason === 'PROHIBITED_CONTENT' || finishReason === 'SAFETY') {
                        userMessage = "Clothing swap blocked by safety filters. Please try different images.";
                    } else if (finishReason) {
                        userMessage = `Clothing swap failed. Reason: ${finishReason.replace(/_/g, ' ')}`;
                    }
                    setErrorMessage(userMessage);
                }
                return;
            }

            if (selectedStyle === 'create-transport-interior') {
                if (!selectedVehicleType || !selectedCameraAngle) return;
                setIsLoading(true);
                setLoadingMessage("Generating scene...");
                setActiveImage(null);
            
                const { instructions: styleInstructions } = prompts.Style;
                const combinedInstructions = [selectedCameraAngle, styleInstructions].filter(Boolean).join('. ');
        
                let contentParts = [];
                let prompt = '';
        
                if (transportCharacterImage) {
                    contentParts.push(fileToGenerativePart(transportCharacterImage));
                }
                if (transportSourceImage) {
                    contentParts.push(fileToGenerativePart(transportSourceImage));
                }
        
                const isFrontOnCarView = selectedVehicleType === 'Private Car' && selectedCameraAngle.includes('front-on view through windshield');
        
                if (isFrontOnCarView && transportSourceImage) {
                    if(transportCharacterImage) {
                        prompt = `**TASK: Recreate a scene from an exterior front view of a car.**
**INPUTS:**
1. **Car Reference Image:** This is the car to be featured.
2. **Character Image:** This image contains the protagonist(s) to place inside the car.
**GOAL:**
Generate a new image looking *through the windshield* from the outside of the car. The protagonist(s) from the Character Image must be visible inside.
**CRITICAL RULES:**
1. **CAMERA POSITION (HIGHEST PRIORITY):** The camera MUST be positioned outside the car, looking in through the front windshield.
2. **MATCH THE CAR:** Analyze the Car Reference Image and make the generated vehicle match its type and color.
3. **PRESERVE PROTAGONIST(S):** The identity and style of the protagonist(s) from the Character Image must be preserved.
4. **CHARACTER PLACEMENT:** Place the character(s) logically inside (e.g., one in driver's seat, one in passenger).
5. **REALISM & REFLECTIONS:** The scene should be photorealistic with natural reflections on the windshield glass.
6. **STYLE MATCHING:** The final scene's style must match the style of the Character Image.
**USER INSTRUCTIONS:** The scene's mood should be: "${styleInstructions || 'A typical drive.'}".`;
                    } else { // No character image
                         prompt = `**TASK: Create an exterior front view of a car with people inside.**
**INPUTS:**
1. **Car Reference Image:** This is the car to be featured.
**GOAL:**
Generate a new photorealistic image looking *through the windshield* from the outside of the car. The car should be occupied by one or two anonymous, natural-looking people.
**CRITICAL RULES:**
1. **CAMERA POSITION (HIGHEST PRIORITY):** The camera MUST be positioned outside the car, looking in through the front windshield.
2. **MATCH THE CAR:** Analyze the Car Reference Image and make the generated vehicle match its type and color.
3. **REALISM & REFLECTIONS:** The scene should look like a still from a movie. Add realistic reflections on the windshield glass.
**USER INSTRUCTIONS:** The scene's mood and time of day should be: "${styleInstructions || 'A typical drive.'}".`;
                    }
                } else if (transportCharacterImage && transportSourceImage) {
                    prompt = `**TASK: Character-in-Vehicle Scene Generation**
**INPUTS:**
1. **Character Image:** An image of the protagonist(s).
2. **Transportation Image:** An image of a vehicle.
**GOAL:**
Analyze both images and generate a single, cohesive new image that places the protagonist(s) from the Character Image *inside* a vehicle of the same type and color as shown in the Transportation Image.
**CRITICAL RULES (MUST FOLLOW):**
1. **ANALYZE & MATCH VEHICLE:** First, identify the vehicle in the Transportation Image (e.g., 'yellow sports car', 'city bus'). The generated interior scene MUST be for that exact type of vehicle.
2. **ANALYZE & PLACE CHARACTERS:** Second, analyze the Character Image to identify the number of people.
    - If it's a private car or taxi: If one person, place them in the driver's seat. If two, place one in the driver's seat and one in the passenger seat. If more, arrange them naturally.
    - If it's public transport (bus/train): Place the protagonists naturally among a crowd of other anonymous passengers.
3. **PRESERVE PROTAGONIST(S):** The identities, faces, clothing, and general appearance of the protagonist(s) from the Character Image must be preserved accurately.
4. **GENERATE NEW INTERIOR:** Do not simply copy the interior from the Transportation Image. Use it as a reference, but generate a new, plausible interior that includes the protagonist(s).
5. **STYLE MATCHING:** The final generated scene's artistic style MUST perfectly match the artistic style of the **Character Image**.
6. **FOLLOW USER INSTRUCTIONS:** The scene's camera angle, mood, and action MUST be based on the user's text prompt.
**USER INSTRUCTIONS:** ${combinedInstructions || "A typical scene."}`;
                } else if (transportCharacterImage) { // Only character image
                    prompt = `**TASK: Character in Vehicle Scene**
**INPUTS:**
1. **Character Image:** An image of the protagonist(s).
**GOAL:**
Place the protagonist(s) from the Character Image inside a **${selectedVehicleType}**.
**CRITICAL RULES:**
1. **PRESERVE PROTAGONIST(S):** Identities, faces, and appearance must be preserved.
2. **GENERATE INTERIOR:** Generate a new, plausible interior for a **${selectedVehicleType}**.
3. **PLACEMENT:** Place the character(s) logically inside (e.g., driver's seat for one person in a car, or naturally seated for public transport). If public transport, add other anonymous passengers.
4. **STYLE MATCHING:** The scene's style must match the Character Image.
**USER INSTRUCTIONS:** ${combinedInstructions || "A typical scene."}`;
                } else if (transportSourceImage) { // Only transport image
                    prompt = `**TASK: Vehicle Interior Scene Generation**
**INPUTS:**
1. **Transportation Image:** A reference image of a vehicle.
**GOAL:**
Analyze the vehicle type from the image and generate a new, photorealistic interior scene for that vehicle, populated with a diverse crowd of anonymous passengers. There should be no single main character.
**CRITICAL RULES:**
1. **REALISTIC ATMOSPHERE:** Create a believable scene of daily life with passengers engaged in typical activities.
2. **GENERATE NEW INTERIOR:** Use the input image as a reference for the vehicle type, but generate a completely new, plausible interior.
**USER INSTRUCTIONS:** ${combinedInstructions || "A typical weekday."}`;
                } else { // No images, just text
                    prompt = `Generate a photorealistic interior scene of a **${selectedVehicleType}**, populated with a diverse crowd of anonymous, natural-looking passengers. There should be no single main character.
**USER INSTRUCTIONS:** ${combinedInstructions || "A typical weekday."}`;
                }
                
                contentParts.push({ text: prompt });
        
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: { parts: contentParts },
                    config: { responseModalities: [Modality.IMAGE] },
                });
        
                const candidate = response.candidates?.[0];
                const generatedImageData = candidate?.content?.parts?.find(p => p.inlineData)?.inlineData;
                if (generatedImageData) {
                    const imageUrl = `data:${generatedImageData.mimeType};base64,${generatedImageData.data}`;
                    updateActiveImage(imageUrl);
                    setCurrentBaseImage(imageUrl);
                    setSessionOriginalImage(imageUrl);
                } else {
                    const finishReason = candidate?.finishReason;
                    let userMessage = "Scene generation failed. Please try again.";
                    if (finishReason === 'PROHIBITED_CONTENT' || finishReason === 'SAFETY') {
                        userMessage = "Scene generation blocked by safety filters. Please adjust your prompt or images.";
                    } else if (finishReason) {
                        userMessage = `Scene generation failed. Reason: ${finishReason.replace(/_/g, ' ')}`;
                    }
                    setErrorMessage(userMessage);
                }
                return;
            }

            if (!activeImage || !selectedStyle) return;

            setIsLoading(true);
            setLoadingMessage("Applying style...");

            const viewportGeneratorPrompt = `**TASK: Create a Viewpoint Generator grid.**

**GOAL:**
Generate a single image arranged in a 2x2 grid. Each of the four quadrants must display the exact same character from the input image, but from a different, distinct camera angle.

**CRITICAL RULES (MUST FOLLOW):**
1.  **CONSISTENT CHARACTER:** The character's identity, face, clothing, art style, and colors MUST remain perfectly consistent across all four panels. It must be the same person.
2.  **2x2 GRID FORMAT:** The final output MUST be a single image divided into a 2x2 grid.
3.  **CLEAN BACKGROUND:** Use a simple, neutral studio background (like light grey or white) for all four shots to emphasize the camera angles.
4.  **NO TEXT/LABELS:** Do not add any text, numbers, or labels like "Top-Down View" to the image. The output should only be the four images in the grid.

**THE FOUR REQUIRED CAMERA ANGLES:**
1.  **Top-Left Quadrant (High-Angle Shot):** A dynamic high-angle view, with the camera positioned significantly above the character, looking down. The character can be looking up towards the camera.
2.  **Top-Right Quadrant (Low-Angle Shot):** A dramatic low-angle view, with the camera positioned near the ground, looking up at the character. This should create a sense of power or scale.
3.  **Bottom-Left Quadrant (Dutch Angle Shot):** A shot where the camera is tilted on its roll axis. The horizon line should be slanted. This creates a feeling of dynamism or unease.
4.  **Bottom-Right Quadrant (Extreme High-Angle / Top-Down Shot):** A very high-angle shot, almost a bird's-eye view, looking down at the character. This should be a different and more extreme high angle than the top-left quadrant.`;
            
            const basePrompts = {
                'remove-watermark': "This image is covered by a repeating watermark pattern. A full-image mask is provided. Your task is to inpaint the entire image, completely removing all traces of the watermark. You must perfectly reconstruct the underlying areas, preserving the original photo's details, colors, textures, and lighting. The final output must be a clean, high-quality version of the image with no watermarks or artifacts.",
                '3d-figure': "turn this photo into a character figure. Behind it, place a box with the character's image printed on it, and a computer showing the Blender modeling process on its screen. In front of the box, add a round plastic base with the character figure standing on it. set the scene indoors if possible",
                'glass-bottle-souvenir': "A 1/7 scale commercialized collectible figure of the character from the photo, crafted in a highly realistic style. The figure is placed in a detailed beach environment with sand, seashells, and gentle ocean waves. The entire toy display is enclosed inside a clear souvenir glass bottle, giving it a premium miniature diorama look, with realistic lighting and shadows.",
                'id-photo': "Crop the head and create a 2-inch ID photo with: 1. Blue background 2. Professional business attire 3. Frontal face 4. Slight smile",
                'map-view': "Generate a realistic, ground-level photograph from the perspective of the red arrow or circle on the input map. Draw the real-world view as if standing at that point, looking in the direction indicated by the arrow. The architecture, environment, and overall atmosphere should accurately reflect the location shown on the map. The final output must be a clean photograph and must NOT contain any text, logos, or map interface elements.",
                'isometric-building': "Extract the main building from the photo. Convert it into an isometric 3D model. The final image should show the building during the daytime, isolated on a clean, white background. Remove all other elements like cars, people, and foliage.",
                'model-cutaway': "Create a cutaway visualization of this car, show exterior intact on one side, and interior engine + seats exposed on the other side. Keep proportions accurate and details realistic.",
                'make-transparent': "Make this object transparent.",
                'multi-view-generation': viewportGeneratorPrompt,
                'character-multi-view': viewportGeneratorPrompt,
                'viewport-generator': viewportGeneratorPrompt,
                'vintage-photo': "Transform the person in the photo to fit a different era or style. It is extremely important to preserve the person's original facial features and identity. Create a realistic, high-quality photograph with cinematic lighting.",
                'bw-to-color': "restore and colorize this photo.",
                'sculpture': "A photorealistic image of an ultra-detailed sculpture of the subject in the provided image, made of shining marble. The sculpture should display a smooth and reflective marble surface, emphasizing its luster and artistic craftsmanship. The design is elegant, highlighting the beauty and depth of marble. The lighting in the image should enhance the sculpture's contours and textures, creating a visually stunning and mesmerizing effect.",
                'create-dish': "Using the ingredients from the provided image, create a single, delicious-looking dish. The final result should be a high-quality, photorealistic image or a beautiful 2D illustration. The dish must be presented on a single plate. The camera view should be zoomed in on the plate. CRITICAL: Remove all unused ingredients, cooking utensils, and other distracting elements from the background. The final image must only show the finished dish on its plate in the specified setting.",
                'cross-view': "Analyze the provided ground-level photograph and transform it into a photorealistic top-down (bird's-eye) view of the exact same location. The final image must be a clean, realistic photograph. CRITICAL: Do NOT add any icons, markers, pins, logos, text, or any other map-like graphical elements to the final image. The output should only be the top-down photograph.",
                'character-sticker': "Transform the character in the provided image into a die-cut sticker. The style should be a clean, modern web illustration with bold lines. The sticker must have a thick white border around the character. Below the character, add a short, playful, and descriptive English phrase (3-5 words) that captures their vibe or personality. The text should be stylish and also have an outline to make it pop. The final output must be the complete sticker isolated on a clean, light grey background, ready to be printed or used digitally.",
                'illustration-pose-sheet': `**TASK: Create a Character Pose Sheet**
**INPUT:** A single image of a character.
**GOAL:** Generate a single image that serves as a professional pose sheet, showcasing the character in multiple different poses.
**CRITICAL RULES:**
1. **PRESERVE IDENTITY:** The character's identity, face, clothing, art style, and colors MUST remain perfectly consistent across all poses. It must be the same character.
2. **VARIETY OF POSES:** Generate at least 5-8 distinct and dynamic poses. Include a mix of action poses (like running, jumping, fighting) and idle/natural poses (like standing, sitting, looking around).
3. **CLEAN PRESENTATION:** Arrange all poses neatly on a single image with a clean, white, or light grey studio background. This is a model sheet, so clarity is key.
4. **NO TEXT/LABELS:** Do not add any text, numbers, or labels to the image.`,
                'pen-display-drawing': `**TASK: Create a First-Person Drawing Scene**
**INPUT:** An image of a finished artwork.
**GOAL:** Generate a photorealistic, first-person view of an artist drawing the input artwork on a professional pen display tablet (like a Wacom Cintiq).

**CRITICAL SCENE ELEMENTS (MUST INCLUDE):**
1.  **First-Person View:** The camera perspective must be from the artist's point of view, looking down at their hands and the tablet.
2.  **Realistic Hands & Pen:** Show a realistic human hand holding a digital drawing pen (stylus). The tip of the pen should be touching the screen, actively working on the drawing.
3.  **Pen Display:** The screen of the pen display must be visible and fill a significant portion of the frame.
4.  **Unfinished Artwork:** The image on the tablet screen MUST be a partially completed version of the input artwork.
    *   **Line Art:** The complete line art of the original image should be visible.
    *   **Partial Coloring:** The coloring should be about 70% complete. Some areas should be fully colored, matching the original artwork, while others remain as just line art or have base colors applied. The artwork must NOT be monochrome.
    *   **UI Elements:** Show a plausible drawing software interface (like Clip Studio Paint or Photoshop) around the canvas on the tablet screen.
5.  **Photorealism:** The entire scene—the hand, the pen, the tablet, the lighting—must be hyper-realistic. The focus should be sharp on the point where the pen meets the screen.
6.  **No Text/Watermarks:** The final output must be purely pictorial.`,
            };
            
            let imagePart;
            let maskPart = null;
            let finalContentParts = null;

            if (selectedStyle === 'map-view') {
                if (!mapMarker) {
                    alert("Please place a marker on the map first.");
                    setIsLoading(false);
                    return;
                }
                const img = imageRef.current;
                if (!img) {
                    throw new Error("Image element not found.");
                }
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    throw new Error("Could not get canvas context.");
                }
                ctx.drawImage(img, 0, 0);

                const scale = img.naturalWidth / displayedImageGeom.width;
                const markerX = mapMarker.x * scale;
                const markerY = mapMarker.y * scale;
                const markerRadius = 15 * scale;
                const markerRotation = mapMarker.rotation;

                ctx.save();
                ctx.translate(markerX, markerY);
                ctx.rotate((markerRotation - 90) * Math.PI / 180);
                
                ctx.beginPath();
                ctx.arc(0, 0, markerRadius, 0, 2 * Math.PI);
                ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
                ctx.fill();
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 2 * scale;
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(0, -markerRadius);
                ctx.lineTo(0, -markerRadius * 2);
                ctx.lineTo(-markerRadius * 0.5, -markerRadius * 1.5);
                ctx.moveTo(0, -markerRadius * 2);
                ctx.lineTo(markerRadius * 0.5, -markerRadius * 1.5);
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 3 * scale;
                ctx.stroke();
                
                ctx.restore();
                
                const imageWithMarker = canvas.toDataURL('image/png');
                imagePart = fileToGenerativePart(imageWithMarker);
            } else {
                 imagePart = fileToGenerativePart(activeImage);
            }
            
            if (selectedStyle === 'remove-watermark') {
                setLoadingMessage("Analyzing image for removal...");
                const whiteMaskDataUrl = await createWhiteMask(activeImage);
                maskPart = fileToGenerativePart(whiteMaskDataUrl);
                setLoadingMessage("Applying style...");
            }


            let prompt;
            const { englishPrompt: styleEnglishPrompt, instructions: styleInstructions } = prompts.Style;
           
            if (promptOverride) {
                prompt = promptOverride;
            } else if (selectedStyle === 'camera-parameters') {
                if (!selectedCameraParameter) {
                    setIsLoading(false);
                    return;
                }
                prompt = `Apply the following photographic style to the image, preserving the subject and composition perfectly: "${selectedCameraParameter.prompt}".`;
                const userInstructions = styleEnglishPrompt || styleInstructions;
                if (userInstructions) {
                    prompt += ` Additionally, incorporate this request: "${userInstructions}".`;
                }
            } else if (selectedStyle === 'upscale') {
                const img = await new Promise((resolve, reject) => {
                    const image = new Image();
                    image.onload = () => resolve(image);
                    image.onerror = () => reject(new Error("Could not load active image for upscaling."));
                    image.src = activeImage;
                });

                const calculateUpscaleSize = (width, height) => {
                    const minLongestSide = 1920;
                    const targetLongestSide = 3840;
                    if (width === 0 || height === 0) return { width: 0, height: 0, needsUpscaling: false };
                    const currentLongestSide = Math.max(width, height);
                    if (currentLongestSide >= minLongestSide) {
                        return { width, height, needsUpscaling: false };
                    }
                    if (width >= height) {
                        const ratio = height / width;
                        return { width: targetLongestSide, height: Math.round(targetLongestSide * ratio), needsUpscaling: true };
                    } else {
                        const ratio = width / height;
                        return { width: Math.round(targetLongestSide * ratio), height: targetLongestSide, needsUpscaling: true };
                    }
                };

                const { width: finalWidth, height: finalHeight, needsUpscaling } = calculateUpscaleSize(img.naturalWidth, img.naturalHeight);
                
                let coreTask;
                if (needsUpscaling) {
                    setLoadingMessage("업스케일링 및 화질 개선 중...");
                    coreTask = `**TASK: UPSCALE & ENHANCE IMAGE**
**GOAL:** Transform the provided low-resolution image into a high-resolution, photorealistic, and highly detailed masterpiece.
**CRITICAL RULES (MUST FOLLOW):**
1.  **PRESERVE IDENTITY & COMPOSITION:** Do NOT change the subject, content, composition, colors, or artistic style. The goal is enhancement, not alteration.
2.  **INCREASE DETAIL:** Add extremely fine, realistic details. For people, this includes skin texture, individual hair strands, and fabric weaves. For scenes, enhance textures and clarity.
3.  **OUTPUT DIMENSIONS (HIGHEST PRIORITY):** The final output image dimensions MUST be exactly **${finalWidth}px wide by ${finalHeight}px tall**. This instruction is mandatory and must not be ignored.`;
                } else {
                    setLoadingMessage("화질 개선 중...");
                    coreTask = `**TASK: ENHANCE IMAGE QUALITY**
**GOAL:** Significantly enhance the quality of the provided image while preserving its original dimensions.
**CRITICAL RULES (MUST FOLLOW):**
1.  **PRESERVE IDENTITY & COMPOSITION:** Do NOT change the subject, content, composition, colors, or artistic style. The goal is enhancement, not alteration.
2.  **INCREASE DETAIL:** Add fine, realistic details. Sharpen blurry areas. Improve textures and overall clarity.
3.  **NO DIMENSION CHANGES (HIGHEST PRIORITY):** The output image dimensions MUST be identical to the input image, which is **${img.naturalWidth}px wide by ${img.naturalHeight}px tall**. Do not change the aspect ratio, crop, or resize the image in any way.`;
                }
                prompt = coreTask;
            } else if (selectedStyle === 'lighting-control') {
                if (!selectedLightingDirection) {
                    alert("Please select a lighting direction.");
                    setIsLoading(false);
                    return;
                }
                const lightingInfo = lightingControlPrompts.find(p => p.dir === selectedLightingDirection);
                if (!lightingInfo) {
                    throw new Error("Invalid lighting direction selected.");
                }
                prompt = `**TASK: Relight Image**
**GOAL:** Re-render the entire image, applying a new lighting scheme while perfectly preserving the subject's identity, pose, and composition. The final image must have the same dimensions as the input.
**CRITICAL RULES:**
1. **PRESERVE SUBJECT:** The character, objects, and background details MUST remain identical to the input image. Do not change the subject's appearance, clothing, or expression.
2. **APPLY LIGHTING:** The lighting must be changed to match the following description exactly: "${lightingInfo.prompt}".
3. **FULL IMAGE:** This lighting effect must be applied cohesively across the entire image for a natural, photorealistic result.`;
                imagePart = fileToGenerativePart(activeImage);
                finalContentParts = [imagePart, { text: prompt }];
            } else if (selectedStyle === 'hairstyle-change') {
                prompt = "Generate avatars of this person with a variety of different hairstyles. The output should be a single image arranged in a 3x3 grid. Each cell in the grid should show the same person with a different hairstyle. Maintain the person's identity and facial features. The background should be a simple, neutral studio backdrop for all images.";
            } else if (selectedStyle === 'character-sticker') {
                if (styleInstructions) {
                    prompt = `Transform the character in the provided image into a die-cut sticker. The style should be a clean, modern web illustration with bold lines. The sticker must have a thick white border around the character. Below the character, add the following exact text: "${styleInstructions}". The text should be stylish and also have an outline to make it pop. The final output must be the complete sticker isolated on a clean, light grey background, ready to be printed or used digitally.`;
                } else {
                    prompt = basePrompts['character-sticker'];
                }
            } else if (selectedStyle === 'illustration-to-photo') {
                setLoadingMessage("Generating photo...");
                prompt = `**TASK: Illustration to Photorealistic Image**
**INPUT:**
1. **Illustration Image:** Use this image ONLY as a reference for the subject's pose and overall composition.
2. **Text Instructions:** Provides details about the desired photorealistic output.
**GOAL:**
Generate a hyper-realistic, high-resolution photograph of a real **${photoDetails.nationality || 'person'}** in a **${photoDetails.background || 'a plausible, realistic setting'}**.
**ABSOLUTE RULES (DO NOT DEVIATE):**
1. **CREATE A NEW, REAL PERSON:** Do not try to recreate the face or art style from the illustration. Based on the specified nationality, create a completely new, believable human face with realistic features.
2. **OUTPUT MUST BE A PHOTOGRAPH:** The result must look like it was taken with a real camera. Do NOT produce anything that looks like a drawing, painting, anime, 3D render, or any form of digital art.
3. **MATCH POSE & COMPOSITION:** The pose and composition of the person in the final photograph must match the input illustration.
4. **FOCUS ON PHOTOGRAPHIC QUALITIES:** Emphasize details like natural skin texture with pores, realistic fabric textures, physically accurate lighting and shadows, and a natural depth of field.`;
            } else if (selectedStyle === 'photo-to-illustration') {
                 if (!photoToIllustrationStyle) {
                    alert("Please select an illustration style first.");
                    setIsLoading(false);
                    return;
                }
                setLoadingMessage("Applying art style...");
                const originalPhotoPart = fileToGenerativePart(activeImage);
                const stylePrompt = `**TASK: Photo to Illustration Style Transfer**
**INPUT:**
1. **Original Photo:** The source image containing the subject and composition.
2. **Text Instructions:** Description of the target illustration style.
**GOAL:**
Transform the provided photograph into a high-quality illustration in the style of: "${photoToIllustrationStyle.name}". Key characteristics of this style are: "${photoToIllustrationStyle.description}".
**CRITICAL RULES:**
1. **PRESERVE IDENTITY & COMPOSITION:** It is crucial to preserve the identity, pose, and composition of the subject(s) from the original photo.
2. **COMPLETE STYLE CHANGE:** Completely change the medium from a photograph to the specified illustration style. The result should look like it was created from scratch in that style, not like a filtered photo.`;
                finalContentParts = [originalPhotoPart, { text: stylePrompt }];
            } else if (selectedStyle === 'ai-photo-editor') {
                const userInstructions = styleEnglishPrompt || styleInstructions;
                const keywordPrompt = getKeywordEnhancedPrompt(userInstructions);
                const COHESION_INSTRUCTION = " **CRITICAL: Treat the entire canvas as a single, cohesive scene. All stylistic and atmospheric effects must be applied consistently from edge to edge for a seamless, photorealistic result, especially if the image was previously edited or expanded.**";
                if (keywordPrompt) {
                    prompt = keywordPrompt;
                } else {
                    prompt = `You are an expert photo editor. The user has provided a photo and a simple request: '${userInstructions || "Enhance this photo beautifully."}'. Your task is to dramatically enhance the photo based on this request. Feel free to make significant changes to the image, including adjusting contrast, saturation, colors, lighting, and mood. You can also improve the composition by cropping, and you have permission to remove or alter distracting elements to create a more compelling, professional, and artistic photograph. The final output must be a high-quality image that fulfills the user's intent in a creative and visually stunning way.` + COHESION_INSTRUCTION;
                }
            } else if (selectedStyle === 'chroma-key') {
                const { instructions: styleInstructions } = prompts.Style;
                const subjectHint = styleInstructions ? `The main subject is: "${styleInstructions}".` : "Identify the main subject in the image.";
                prompt = `**TASK: Create a Chroma Key Image (Green Screen)**

**GOAL:**
Isolate the main subject from the background and replace the background with a solid chroma key green color (#00ff00).

**CRITICAL RULES (MUST FOLLOW):**
1.  **Subject Identification:** ${subjectHint}
2.  **Perfect Isolation:** Create a precise and clean cutout of the identified subject. The edges must be sharp with no background bleeding.
3.  **Background Replacement:** The entire background, and only the background, must be replaced with a uniform, solid green color. The exact color is chroma key green, hex code #00ff00.
4.  **Preserve Subject:** The subject itself—its colors, lighting, textures, and details—must remain completely unchanged. Do not alter the subject in any way.
5.  **No Shadows on Green Screen:** Do not cast any shadows from the subject onto the green screen background.

The final output must be the isolated subject on a perfect green screen.`;
            } else if (selectedStyle === 'fisheye-peephole') {
                const userInstructions = styleEnglishPrompt || styleInstructions;
                prompt = `**TASK: Fisheye Peephole Illustration**
**INPUT:**
1. **Character Image:** An image containing the character(s) to be drawn.
2. **Text Instructions:** User's specific requests for style, background, etc.

**GOAL:**
Re-draw the character(s) from the Character Image as a detailed illustration seen through a fisheye peephole lens.

**CORE STYLE (BASE PROMPT):**
ultra-detailed anime illustration, fisheye lens peephole perspective, circular distorted view as if looking through a door peephole, warped wide-angle effect with curved edges, darkened vignette around the circular frame, two people leaning their faces close to the peephole trying to peek through, both with mischievous playful smiles, exaggerated perspective distortion making their features appear larger and curved, faces approaching the peephole lens, hallway or room interior bent by the lens effect, slightly blurry edges mimicking actual peephole optics, playful atmosphere, 8k resolution.

**CRITICAL RULES:**
1. **PRESERVE CHARACTER IDENTITY:** The character(s) in the final illustration MUST be identifiable as the one(s) from the input Character Image. Preserve their key features, hair, and clothing style.
2. **APPLY PEEPHOLE EFFECT:** The entire scene MUST have the described fisheye/peephole distortion. This is the highest priority.
3. **INCORPORATE USER REQUESTS:** If the user provides additional instructions, they must be integrated into the final image.

**USER INSTRUCTIONS:** ${userInstructions || "Create a standard peephole view as described."}`;
            } else if (selectedStyle === 'movie-poster') {
                const starringText = moviePosterStarring || "a character from the image";
                const titleInstruction = moviePosterDetails.title ? `Use this exact title: "${moviePosterDetails.title}"` : 'Generate an impactful, genre-authentic cinematic movie title.';
                const taglineInstruction = moviePosterDetails.tagline ? `Use this exact tagline: "${moviePosterDetails.tagline}"` : 'Generate a short, dramatic or emotional tagline (1-2 lines).';
                const creditsInstruction = moviePosterDetails.credits ? `Use this exact credit block text: "${moviePosterDetails.credits}"` : 'Generate a standard credit block at the bottom (with fake names for director, producer, music, etc.).';
                const releaseInstruction = moviePosterDetails.release ? `Use this exact release note: "${moviePosterDetails.release}"` : 'Generate a release note such as “COMING SOON” or “In Theaters 2025.”';

                prompt = `Analyze the uploaded photo to determine its subject, mood, and a suitable movie genre. Based on this analysis, generate a complete movie poster by overlaying text onto the image.

Follow these instructions for each text element:

**Movie Title:**
${titleInstruction}

**Tagline:**
${taglineInstruction}

**Starring Section:**
Use this exact text: "Starring: ${starringText}"

**Credit Block:**
${creditsInstruction}

**Release Note:**
${releaseInstruction}

**Layout & Style Instructions:**
- Overlay all text elements onto the image in a professional movie-poster style layout.
- The typography must be bold, dramatic, and appropriate for the detected genre.
- The final result must look like a genuine movie poster. Do not alter the original image itself, only add the text overlay.`;
            } else {
                 if (selectedStyle && basePrompts[selectedStyle]) {
                     prompt = basePrompts[selectedStyle];
                 } else {
                     prompt = "Apply a new style to the image.";
                 }

                 const userInstructions = styleEnglishPrompt || styleInstructions;
                 const finalInstructions = getKeywordEnhancedPrompt(userInstructions) || userInstructions;
                 if (finalInstructions) {
                    prompt += ` Additionally, incorporate this request: "${finalInstructions}".`;
                }
            }

            let contentParts;
            if (finalContentParts) {
                contentParts = finalContentParts;
            } else {
                contentParts = [];
                if (imagePart) contentParts.push(imagePart);
                if (maskPart) contentParts.push(maskPart);
                if (prompt) contentParts.push({ text: prompt });
            }
            
            setIsLoading(true);
            setLoadingMessage("Applying style...");

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: contentParts },
                config: { responseModalities: [Modality.IMAGE] },
            });

            const candidate = response.candidates?.[0];
            const generatedImageData = candidate?.content?.parts?.find(p => p.inlineData)?.inlineData;

            if (generatedImageData) {
                const imageUrl = `data:${generatedImageData.mimeType};base64,${generatedImageData.data}`;
                updateActiveImage(imageUrl);
                setCurrentBaseImage(imageUrl);
                setSessionOriginalImage(imageUrl);
                if (selectedStyle === 'map-view') {
                    setMapMarker(null);
                }
            } else {
                const finishReason = candidate?.finishReason;
                console.error("Style generation failed. Finish Reason:", finishReason);
                let userMessage = "Failed to generate styled image. Please try again.";
                if (finishReason === 'PROHIBITED_CONTENT' || finishReason === 'SAFETY') {
                    userMessage = "Generation blocked by safety filters. Please adjust your prompt or image.";
                } else if (finishReason) {
                    userMessage = `Generation failed. Reason: ${finishReason.replace(/_/g, ' ')}`;
                }
                setErrorMessage(userMessage);
            }
        } catch (e) {
            console.error("Style generation error:", e);
            setErrorMessage("An unexpected error occurred during style generation.");
        } finally {
            setIsLoading(false);
        }
    }, [apiKey, isLoading, activeImage, selectedStyle, prompts.Style, moviePosterStarring, moviePosterDetails, mapMarker, displayedImageGeom, photoDetails, photoToIllustrationStyle, clothingSwapSourceImage, clothingSwapReferenceImage, transportCharacterImage, transportSourceImage, selectedCameraAngle, selectedVehicleType, selectedCameraParameter, selectedLightingDirection, productMockupObjectImage, productMockupDesignImage]);
    
    const handleVintageStyleSubmit = useCallback((details) => {
        const koreanInstructions = [
            details.era && `시대: ${details.era}`,
            details.hairstyle && `헤어스타일: ${details.hairstyle}`,
            details.features && `얼굴 특징: ${details.features}`,
            details.clothing && `의상: ${details.clothing}`,
            details.background && `배경: ${details.background}`,
            details.extra && `추가 요청: ${details.extra}`
        ].filter(Boolean).join(', ');
        
        const basePrompt = "Transform the person in the photo to fit a different era or style. It is extremely important to preserve the person's original facial features and identity. Create a realistic, high-quality photograph with cinematic lighting.";

        const englishPromptParts = [
            details.era && `the era should be ${details.era}`,
            details.hairstyle && `their hairstyle should be ${details.hairstyle}`,
            details.features && `add facial features like ${details.features}`,
            details.clothing && `they should be wearing ${details.clothing}`,
            details.background && `the background should be ${details.background}`,
            details.extra
        ].filter(Boolean).join('. ');

        const finalPrompt = `${basePrompt} The specific instructions are: ${englishPromptParts}.`;
        
        setInstructions(koreanInstructions);
        setEnglishPrompt(englishPromptParts);
        setIsVintageModalOpen(false);
        handleGenerateStyle(finalPrompt);
    }, [handleGenerateStyle, setInstructions, setEnglishPrompt]);


    const handleResetStyle = useCallback(() => {
        setActiveImage(null);
        setCurrentBaseImage(null);
        setSessionOriginalImage(null);
        setImageHistory([]);
        setSelectedStyle('');
        setMoviePosterStarring('');
        setMoviePosterDetails({ title: '', tagline: '', credits: '', release: '' });
        setMapMarker(null);
        setPhotoDetails({ background: '', nationality: '' });
        setPhotoToIllustrationStyle(null);
        setOpenIllustrationCategory(null);
        setSelectedCameraParameter(null);
        setSelectedLightingDirection(null);
        setStyleComparisonOriginal(null);
        setCharacterDesignSourceImage(null);
        setActiveCharacterDesignSubMenu(null);
        setClothingSwapSourceImage(null);
        setClothingSwapReferenceImage(null);
        setTransportSourceImage(null);
        setTransportCharacterImage(null);
        setSelectedVehicleType('');
        setSelectedCameraAngle('');
        setProductMockupObjectImage(null);
        setProductMockupDesignImage(null);
        setPrompts(p => ({ ...p, Style: { ...initialPromptState } }));
        setErrorMessage(null);
    }, []);
    // --- END: Style Menu Logic ---

    // --- START: Character Design Logic ---
    const handleGenerateCharacterDesign = useCallback(async () => {
        if (isLoading || !characterDesignSourceImage || !activeCharacterDesignSubMenu || !apiKey) {
            alert("Please upload a source image and select a design option.");
            return;
        }
        
        setErrorMessage(null);
        setIsLoading(true);
        setLoadingMessage("Generating character sheet...");
        setActiveImage(null);
        setImageHistory([]);
        setCurrentBaseImage(null);
        setSessionOriginalImage(null);

        try {
            const ai = new GoogleGenAI({apiKey: apiKey});
            const imagePart = fileToGenerativePart(characterDesignSourceImage);
            let prompt = '';

            switch (activeCharacterDesignSubMenu) {
                case 'turnaround':
                    prompt = "Using the provided character image, create a character turnaround sheet. It must show the character from the front, quarter, side, and back views. Maintain the character's design, style, and proportions consistently across all views. The output should be on a clean, white background.";
                    break;
                case 'expression':
                    prompt = "Based on the provided character image, generate a character sheet showing a variety of facial expressions. The expressions to include are: Joy, Anger, Sorrow, Delight, Surprise, Embarrassment, Neutral, Touched, Tired, Shy, and Confident. Maintain the character's identity and art style consistently across all expressions. The output should be a single image organized like a grid or a model sheet on a clean, white background.";
                    break;
                case 'pose':
                    prompt = "From the input character image, create a dynamic pose sheet. Generate 4-6 different action or idle poses for the character, such as walking, running, sitting, and a dynamic action pose relevant to the character's design. The character's identity, clothing, and style must be consistent across all poses. Arrange them neatly on a single image with a clean, white background.";
                    break;
                case 'proportion':
                    prompt = `**CRITICAL TASK: Create a detailed age progression character sheet.**

**Reference Image:** The provided image is the character in their **20s-30s (Adult)**.

**Your Goal:** Generate a single image, formatted as a professional model sheet, that shows the same character at different stages of life.

**CRITICAL RULES:**
1.  **PRESERVE IDENTITY:** The character's core facial features and identity MUST remain recognizable across all ages.
2.  **FOUR AGE STAGES:** The final image must contain exactly four versions of the character, arranged horizontally, side-by-side, from left to right in the following order:
    *   **Age 5-7 (Child):** Show the character as a young child.
    *   **Age 15-17 (Teenager):** Show the character as a teenager.
    *   **Age 20s-30s (Adult - Reference):** This should be a clean, full-body recreation of the character from the input image.
    *   **Age 60-70s (Elderly):** Show the character as an elderly person.
3.  **CONSISTENT STYLE:** The art style (e.g., anime, realistic, cartoon) must be identical to the input image for all four age versions.
4.  **CLEAN BACKGROUND:** All characters must be on a single, clean, white or light-grey studio background.
5.  **NO TEXT/LABELS:** Do not add any text like "Age 5" or "Adult" to the image.`;
                    break;
            }

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [imagePart, { text: prompt }] },
                config: { responseModalities: [Modality.IMAGE] },
            });

            const candidate = response.candidates?.[0];
            const generatedImageData = candidate?.content?.parts?.find(p => p.inlineData)?.inlineData;

            if (generatedImageData) {
                const imageUrl = `data:${generatedImageData.mimeType};base64,${generatedImageData.data}`;
                updateActiveImage(imageUrl);
                setCurrentBaseImage(imageUrl);
                setSessionOriginalImage(imageUrl);
            } else {
                const finishReason = candidate?.finishReason;
                let userMessage = "Character sheet generation failed. Please try again.";
                if (finishReason === 'PROHIBITED_CONTENT' || finishReason === 'SAFETY') {
                    userMessage = "Generation blocked by safety filters. Please try a different image.";
                } else if (finishReason) {
                    userMessage = `Generation failed. Reason: ${finishReason.replace(/_/g, ' ')}`;
                }
                setErrorMessage(userMessage);
            }

        } catch(e) {
            console.error("Character design generation error:", e);
            setErrorMessage("An unexpected error occurred during character sheet generation.");
        } finally {
            setIsLoading(false);
        }
    }, [apiKey, isLoading, characterDesignSourceImage, activeCharacterDesignSubMenu]);


    const MenuButton = ({ name, icon, active }) => (
        <button
            onClick={() => setActiveMenu(name)}
            className={`flex flex-col items-center justify-center space-y-2 p-3 rounded-lg transition-colors duration-200 w-24 h-24 ${active ? 'bg-pink-600 text-white shadow-lg' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
        >
            {icon}
            <span className="text-xs font-semibold">{name}</span>
        </button>
    );

    if (authStatus === 'waiting') {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-900 text-slate-300">
                <div className="text-center">
                    <FaSyncAlt className="animate-spin text-4xl mx-auto mb-4 text-pink-500" />
                    <h1 className="text-2xl font-bold">인증 정보 대기 중...</h1>
                    <p className="mt-2 text-slate-400">부모 창(aitoolshub.kr)으로부터 API 키를 받고 있습니다.</p>
                </div>
            </div>
        );
    }

    if (authStatus === 'error') {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-900 text-slate-300">
                <div className="text-center p-8 bg-slate-800 rounded-lg shadow-xl max-w-md">
                    <svg className="mx-auto mb-4 w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <h1 className="text-2xl font-bold text-red-400">접근 오류</h1>
                    <p className="mt-2 text-slate-400">
                        이 애플리케이션은 보안상의 이유로 <a href="https://aitoolshub.kr" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline font-semibold">aitoolshub.kr</a> 웹사이트를 통해서만 접근할 수 있습니다.
                    </p>
                    <p className="mt-4 text-xs text-slate-500">
                        직접 주소로 접근하셨거나, 부모 창에서 API 키를 전달받지 못했습니다.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-900 text-slate-300 font-sans">
            {/* Left Panel */}
            <div className="w-1/4 max-w-sm flex flex-col p-4 space-y-4 bg-slate-800/50 overflow-y-auto">
                <div className="flex items-center space-x-3 pb-2 border-b border-slate-700">
                   <h1 className="text-2xl font-bold text-white tracking-wider">AI Image Suite</h1>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <MenuButton name="Pose" icon={<FaUserAlt className="w-6 h-6" />} active={activeMenu === 'Pose'} />
                    <MenuButton name="Editor" icon={<FaEdit className="w-6 h-6" />} active={activeMenu === 'Editor'} />
                    <MenuButton name="Expand" icon={<FaArrowsAltH className="w-6 h-6" />} active={activeMenu === 'Expand'} />
                    <MenuButton name="CameraPosition" icon={<FaCamera className="w-6 h-6" />} active={activeMenu === 'CameraPosition'} />
                    <MenuButton name="Style" icon={<FaPalette className="w-6 h-6" />} active={activeMenu === 'Style'} />
                </div>
                
                <div className="flex-grow">
                    {/* Pose Menu */}
                    {activeMenu === 'Pose' && (
                        <div className="space-y-4">
                            <ImageUpload title="1. 캐릭터 이미지" subtitle="캐릭터 업로드" imageUrl={sourceImage} onImageUpload={setSourceImage} disabled={isLoading || activeImage} />
                            <ImageUpload title="2. 포즈 레퍼런스" subtitle="포즈 업로드" imageUrl={poseReferenceImage} onImageUpload={setPoseReferenceImage} disabled={isLoading || activeImage} />
                            <div className="space-y-2">
                                 <label htmlFor="poseInstructions" className="font-semibold text-slate-400">3. 지시사항 (선택사항)</label>
                                 <textarea id="poseInstructions" value={instructions} onChange={e => setInstructions(e.target.value)} rows={3} placeholder="배경을 바꿔주세요. 예: '밤의 도시로 배경을 바꿔줘'" className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md resize-none" disabled={isLoading}></textarea>
                            </div>
                            <button onClick={handleGeneratePose} disabled={isLoading || (!activeImage && (!sourceImage || !poseReferenceImage))} className="w-full bg-pink-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-pink-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
                                {isLoading ? '생성 중...' : (activeImage ? '배경 변경' : '포즈 적용하기')}
                            </button>
                            {activeImage && <button onClick={() => { setSourceImage(null); setPoseReferenceImage(null); setActiveImage(null); setCurrentBaseImage(null); setImageHistory([]); setSessionOriginalImage(null); setPrompts(p => ({ ...p, Pose: initialPromptState })); }} className="w-full bg-slate-600 text-slate-300 font-bold py-2 px-4 rounded-lg hover:bg-slate-700">새 작업 시작</button>}
                        </div>
                    )}
                    {/* ... Rest of the menus will go here ... */}
                </div>
            </div>

            {/* Main Canvas */}
            <div className="flex-1 flex flex-col p-4">
                 <div className="flex justify-between items-center mb-4">
                     <h2 className="text-xl font-bold">{activeMenu}</h2>
                     <div className="flex space-x-2">
                         {imageHistory.length > 1 && <button onClick={handleUndo} className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600" title="Undo"><FaUndo /></button>}
                         <button onClick={handleDownload} disabled={!activeImage} className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 disabled:opacity-50" title="Download Image"><FaDownload /></button>
                     </div>
                 </div>
                 <div ref={canvasContainerRef} className="flex-1 bg-slate-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                      {isLoading ? (
                        <div className="text-center">
                            <FaSyncAlt className="animate-spin text-4xl mx-auto mb-4 text-pink-500" />
                            <p>{loadingMessage}</p>
                        </div>
                    ) : activeImage ? (
                            <img ref={imageRef} src={activeImage} alt="Generated" className="object-contain max-h-full max-w-full" />
                    ) : (
                        <div className="text-center text-slate-500">
                            <FaRegImage className="mx-auto h-24 w-24 mb-4" />
                            <p className="text-lg font-semibold">이미지 생성 결과가 여기에 표시됩니다.</p>
                        </div>
                    )}
                    {errorMessage && (
                        <div className="absolute bottom-4 left-4 right-4 bg-red-800/90 text-white p-3 rounded-lg flex items-center justify-between shadow-lg">
                            <p className="text-sm">{errorMessage}</p>
                            <button onClick={() => setErrorMessage(null)}><FaTimes /></button>
                        </div>
                    )}
                 </div>
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
