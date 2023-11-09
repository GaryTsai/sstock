import styled from '@emotion/styled'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import browserUtils from "./../../../utils/browserUtils";
import api from '../../../api/api';
import _ from "lodash";
import { useSelector } from 'react-redux';
import { fetchStockComment } from '../../../slices/apiDataSlice';
import { useDispatch } from 'react-redux';

const StockComment = () => {
  const { stockComment } = useSelector((state) => state.apiDataReducer)
  const [isShowComment, setIsShowComment] = useState(false)
  const isMobile = browserUtils.isMobile()
  const [comment, setComment] = useState(stockComment)
  const textareaInput = useRef();
  const dispatch = useDispatch()


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
      return <>
          <ImgCommentStyle src={require('./../../../assets/img/comment.png')} onClick={() => {
            setIsShowComment(!isShowComment)
            }} isShowComment={isShowComment}/>
      </>
  }

  const ImgCommentStyle = styled("img")(({ isShowComment, isMobile}) => ({
    boxShadow: isShowComment ? "0 0 20px #d71313" : 'unset',
    cursor: "pointer",
    width: "32px",
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
  const textAreaStyle = {
    height: "200px",
    width: isMobile ? "100%" : "360px",
    border: "0px",
    overflowY: "hidden",
    "&:focus": {
        outline: "none !important",
        boxShadow: "0px 12px 20px rgba(0,0,0,0.8)"
    }};

  const commentWrapperStyle = {
    display: "inline-block",
    position: "relative",
    zIndex: 2,
    width: "100%",
    height: isMobile ? "auto" : "0px",
    marginLeft: isMobile ? "auto" : "0.5rem",
    marginTop: isMobile ? "0.5rem" : "auto",
  }

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
            isShowComment && <div 
            style={commentWrapperStyle}>
              <CommentTitle for="exampleFormControlTextarea1" class="form-label">股票記事</CommentTitle>
                <textarea type="text" class="form-control" id="exampleFormControlTextarea1" rows="3" style={{...textAreaStyle}}onChange={(e)=> handleTextarea(e.target.value)}>{comment}</textarea>
              <CommentConfirm onClick={()=> {
                debounce(comment)
                setIsShowComment(!isShowComment)}}>確認
              </CommentConfirm>
          </div>
        }
    </>
  )
}

export default StockComment

{/* 

          <CommentTitle for="exampleFormControlTextarea1" class="form-label">股票記事</CommentTitle>
            <CommentTextArea type="text" class="form-control" id="exampleFormControlTextarea1" rows="3" isMobile={isMobile} ref={textareaInput} 
            onChange={(e)=> handleTextarea(e.target.value)}
            >{comment}</CommentTextArea>
            <CommentConfirm onClick={()=> {
             debounce(comment)
             setIsShowComment(!isShowComment)}}>確認</CommentConfirm> */}