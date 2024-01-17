import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useDispatch, useSelector} from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled'
import _ from "lodash";

import api from '../../../api/api';
import { fetchStockComment } from '../../../slices/apiDataSlice';
import './style.css';


const StockComment = () => {
  const { stockComment } = useSelector((state) => state.apiDataReducer)
  const [isShowComment, setIsShowComment] = useState(false)
  const [comment, setComment] = useState(stockComment)
  const textareaInput = useRef();
  const dispatch = useDispatch()
  const {t} = useTranslation()

  useEffect(() => {
    dispatch(fetchStockComment())
  }, [])
  
  useEffect(() => {
    setComment(stockComment)
 },[stockComment]) 

  useEffect(() => {
    textareaInput.current && textareaInput.current.focus();
  }, [comment]);
  
  
  const ImgComment = () => {
      return <DivCenter>
          <ImgCommentStyle src={require('./../../../assets/img/comment.png')} onClick={() => {
            setIsShowComment(!isShowComment)
            }} isShowComment={isShowComment}/>
      </DivCenter>
  }
  const DivCenter = styled("div")`
    @media (max-width: 768px) {
      width: 100%;
      text-align: center;
    }
  `

  const ImgCommentStyle = styled("img")(({ isShowComment }) => ({
    boxShadow: isShowComment ? "0 0 20px #d71313" : 'unset',
    cursor: "pointer",
    width: "32px",
    height: "32px",
    borderRadius: "1rem",
    marginLeft: "0.5rem"
  }));

  const CommentTitle = styled('label')`
      font-weight: bold;
      width: 100%;
      color: #f0f0f0;
      display: block;
      text-align: center;
      margin-bottom: 0px;
      background: linear-gradient(90deg, rgb(118 40 170) 0%, rgb(218 15 15) 0%, rgb(205 148 69) 100%);
      border-radius: 15px 15px 0 0;
      line-height: 30px;
      `
  const CommentConfirm = styled('div')`
    font-weight: bold;
    width: 100%;
    color: #f0f0f0;
    display: block;
    text-align: center;
    margin-bottom: 0px;
    background-color: #4CAF50;
    border-radius: 0 0 15px 15px;
    line-height: 30px;
    cursor: pointer;
    top: -10px;
    position: relative;
    :hover {
      background-color: #17871b;
    }
  `

  const debounce = useCallback(
    _.debounce((stockComment) => {
      api.updateStockComment(stockComment).then(()=>{
        dispatch(fetchStockComment())
      })
    }, 1000),
    []
  );  

  const handleTextarea = comment => {
    setComment(comment)
  }
  return (
    <>
        <ImgComment/>
        {
            isShowComment && <div  className="comment-wrapper">
              <CommentTitle htmlFor="exampleFormControlTextarea1" className="form-label">{t('comment')}</CommentTitle>
                <textarea type="text" className="form-control width-range" id="exampleFormControlTextarea1" rows="3" onChange={(e)=> handleTextarea(e.target.value)}>{comment}</textarea>
              <CommentConfirm onClick={()=> {
                debounce(comment)
                setIsShowComment(!isShowComment)}}>{t('confirm')}
              </CommentConfirm>
          </div>
        }
    </>
  )
}

export default StockComment