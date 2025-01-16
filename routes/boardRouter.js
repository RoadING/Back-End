const express = require("express");
const router = express.Router();
const Board = require("../schemas/board");

router.post("/delete", async (req, res) => {
  try {
    const board = await Board.findOne({ _id: req.body._id });
    
    if (!board) {
      return res.json({
        message: "게시글을 찾을 수 없습니다.",
        success: false
      });
    }

    if (board.writer.toString() !== req.body.writer_id) {
      return res.json({
        message: "게시글 삭제 권한이 없습니다.",
        success: false
      });
    }

    await Board.deleteOne({ _id: req.body._id });
    res.json({
      message: "게시글이 삭제되었습니다.",
      success: true
    });
  } catch (err) {
    console.log(err);
    res.json({
      message: "서버 오류가 발생했습니다.",
      success: false
    });
  }
});

router.post("/update", async (req, res) => {
  try {
    const board = await Board.findOne({ _id: req.body._id });
    
    if (!board) {
      return res.json({
        message: "게시글을 찾을 수 없습니다.",
        success: false
      });
    }

    if (board.writer.toString() !== req.body.writer_id) {
      return res.json({ 
        message: "게시글 수정 권한이 없습니다.",
        success: false 
      });
    }

    await Board.updateOne(
      { _id: req.body._id },
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          coordinates: req.body.coordinates,
          address: req.body.address
        }
      }
    );
    res.json({ 
      message: "게시글이 수정되었습니다.",
      success: true 
    });
  } catch (err) {
    console.log(err);
    res.json({ 
      message: "서버 오류가 발생했습니다.",
      success: false 
    });
  }
});

router.post("/write", async (req, res) => {
  try {
    let obj = {
      writer: req.body._id,
      title: req.body.title,
      content: req.body.content,
      address: req.body.address,
      coordinates: req.body.coordinates
    };

    const board = new Board(obj);
    await board.save();
    res.json({ message: "게시글이 업로드 되었습니다." });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/getBoardList", async (req, res) => {
  try {
    const _id = req.body._id;
    const board = await Board.find({ writer: _id }, null, {
      sort: { createdAt: -1 }
    });
    res.json({ list: board });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/detail", async (req, res) => {
  try {
    const _id = req.body._id;
    const board = await Board.find({ _id });
    res.json({ board });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.get("/getAllPosts", async (req, res) => {
  try {
    const board = await Board.find({})
      .populate('writer', 'name')
      .sort({ createdAt: -1 });
    res.json({ list: board });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

module.exports = router;
