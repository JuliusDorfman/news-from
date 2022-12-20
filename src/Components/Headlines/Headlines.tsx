import React, { useState, useEffect, useRef, memo } from 'react';
import Spinner from '../Spinner/Spinner';
import './Headlines.scss';


interface Headline {
  title: string;
  link: string;
  content: string;
  contentSnippet: string;
  guid: string;
  showSnippet: boolean;
}


const Headlines: React.FC<{ headlines: Headline[] }> = memo((props) => {
  const [headlines, setHeadlines] = useState(props.headlines);

  const toggleShowSnippet = (index: number) => {
    console.log("index: ", index);
    const newHeadlines = [...headlines];
    newHeadlines[index].showSnippet = !newHeadlines[index].showSnippet;
    setHeadlines(newHeadlines);
  };

  const toggleShowSnippetRef = useRef<(index: number) => void>();

  useEffect(() => {
    toggleShowSnippetRef.current = toggleShowSnippet;
  }, [toggleShowSnippet]);

  useEffect(() => {
    setHeadlines(
      props.headlines.map((headline: Headline) => ({
        ...headline,
        showSnippet: false,
      }))
    );
  }, [props.headlines]);

  if (headlines && headlines.length > 0) {
    return (
      <div className="headlines__component">
        <ul className="headlines__container">
          {headlines.map((headlines: any, index: number) => (
            <li className="headlines__wrapper" key={index}>
              <div className="headlines__headline">
                <h6 onClick={() => toggleShowSnippetRef.current && toggleShowSnippetRef.current(index)}>
                  &#8250; &nbsp; {`${headlines.title}`}
                </h6>
                <p className={`show-snippet-${headlines.showSnippet}`}>
                  {headlines.contentSnippet !== "" && headlines.contentSnippet !== undefined
                    ?
                    headlines.contentSnippet
                    :
                    "No snippet available"
                  }
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  } else {
    return (
      <div>
        <Spinner />
      </div>
    );
  }
});

export default Headlines;
