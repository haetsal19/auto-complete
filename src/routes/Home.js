import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';
import { Link, useNavigate } from 'react-router-dom';


export default function Home() {
    const [query, setQuery] = useState("");
    const [titleList, setTitleList] = useState([]);
    const [selectedTitle, setSelectedTitle] = useState({});
    const navigate = useNavigate();

    const keyDownHandler = (e) => {
        let index = 0;
        switch (e.keyCode) {
            case 13:
                if (selectedTitle.id !== undefined) navigate(`/about/${selectedTitle.id}`);
                break;
            case 38:
                setSelectedTitle((prev) => {
                    if (!(selectedTitle.id === undefined || selectedTitle === titleList.at(0))) index = titleList.indexOf(prev);
                    console.log(index);
                    return titleList.at(index - 1);
                });
                break;
            case 40:
                setSelectedTitle((prev) => {
                    if (!(selectedTitle.id === undefined || selectedTitle === titleList.at(-1))) index = titleList.indexOf(prev) + 1;
                    return titleList.at(index);
                });
                break;
            default:
                break;
        }
    }

    const getData = useCallback(async (query) => {
        if (query.length === 0) {
            setTitleList(() => []);
            return;
        };

        try {
            const response = await axios.get(`https://hn.algolia.com/api/v1/search?query=${query}&hitsPerPage=50`);
            const result = response.data.hits;
            setTitleList(result.filter(({ title }) => title !== null && title.toLowerCase().startsWith(query.trim().toLowerCase())).map(({ title, objectID }) => {
                return { title, id: objectID }
            }))
        } catch (e) {
            console.log(e);
        }
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => { return getData(query) }, 200);
        return () => clearTimeout(timer);
    }, [query, getData]);

    return (
        <>
            <input type="text" value={query} onKeyDown={keyDownHandler} onChange={(e) => setQuery(e.target.value)} />
            <ul>
                {titleList.map(({ title, id }) => {
                    return (
                        <Link to={`/about/${id}`} key={id}>
                            <li className={selectedTitle.id === id ? 'selected' : ''}>{title}</li>
                        </Link>
                    )
                })}
            </ul>
        </>
    );
}