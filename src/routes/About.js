import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import './About.css';
import { Link, useParams } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';

export default function About() {
    const id = useParams().id;
    const [data, setData] = useState({
        title: '',
        author: '',
        points: 0,
        comment: [],
        url: '',
    });

    const getResponse = useCallback(async () => {
        const response = await axios.get(`https://hn.algolia.com/api/v1/items/${id}`);
        const newData = {
            title: response.data.title,
            author: response.data.author,
            points: response.data.points,
            comment: response.data.children
                .filter(({ text }) => text !== null)
                .map(({ id, text }) => { return { id, text } }),
            url: response.data.url,
        }
        setData(newData);
    }, [id]);

    useEffect(() => {
        getResponse();
    }, [getResponse])

    if (data.title === '') return <p>Loading...</p>
    return (
        <div>
            <ul>
                <Link to={'/'}>Go Home</Link>
                <li>Title : <a href={data.url} rel="noopener noreferrer" target="_blank">{data.title}</a></li>
                <li>Author : {data.author}</li>
                <li>points : {data.points}</li>
            </ul>
            <ul>
                <li>comments</li>
                {data.comment.map(({ id, text }) => {
                    return <li key={id}>{ReactHtmlParser(text)}</li>
                })}
            </ul>
        </div>
    );
}