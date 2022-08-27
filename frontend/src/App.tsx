import React, { useRef, useState } from 'react';
import './App.css';

type Marker = { start: number; end: number };

const TEXT =
    '012345678910 рыбатекст поможет дизайнеру, верстальщику, вебмастеру сгенерировать несколько абзацев более менее осмысленного текста рыбы на русском языке, а начинающему оратору отточить навык публичных выступлений в домашних условиях. При создании генератора мы использовали небезизвестный универсальный код речей. Текст генерируется абзацами случайным образом от двух до десяти предложений в абзаце, что позволяет сделать текст более привлекательным и живым для визуально-слухового восприятия.\n' +
    '\n' +
    'По своей сути рыбатекст является альтернативой традиционному lorem ipsum, который в';

const markers = [
    { start: 0, end: 10 },
    { start: 50, end: 100 },
    { start: 150, end: 200 }
];

function App() {
    const [positions, setPositions] = useState<Marker[]>(markers);
    const [text, setText] = useState<string>(TEXT);
    const [highLight, setHighlightText] = useState<string>(TEXT);
    const getText = (text: string, markers: Marker[]): string => {
        return Array.from(text).reduce((acc, curr, strIndex) => {
            markers.map(({ end, start }) => {
                if (strIndex === start) {
                    curr = '<span class="kek">' + curr;
                }
                if (strIndex === end) {
                    curr += '</span>';
                }
            });
            acc += curr;
            return acc;
        }, '');
    };

    const handleChange = (value: string) => {
        setPositions(JSON.parse(value));
    };

    const onClick = () => {
        setHighlightText(getText(text, positions));
    };

    const txtarea = useRef(null);
    return (
        <>
            <button onClick={onClick}>Погнали</button>
            <p
                dangerouslySetInnerHTML={{
                    __html: highLight
                }}
            />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <textarea
                ref={txtarea}
                rows={50}
                onChange={(e) => handleChange(e.target.value)}
                value={JSON.stringify(positions ? positions : {}, null, 4)}
            />
        </>
    );
}

export default App;
