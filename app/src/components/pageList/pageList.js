import React, {useState, useEffect} from "react";
import axios from "axios";

const PageList = ({init, setShowChooseModal}) => {
    const [pageList, setPageList] = useState([]);

    const loadPageList = () => {
        axios
            .get("./api/pageList.php")
            .then(res => setPageList(res.data));
    }

    useEffect(() => {
        loadPageList();
    }, [])

    const pages = pageList.map((page, i) => {
        return (
            <li  key={i}>
                <a 
                onClick={(e) => {
                    init(e, page);
                    setShowChooseModal(false);
                }}
                className="uk-link-muted" 
                href='#'>{page}</a>
            </li>
        )
    });

    return (
        <>
            {pages}
        </>
    )
}

export default PageList;