import axios from "axios";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import openai from "../configs/openai.js";
import imageKit from "../configs/imagekit.js";

// Test-based AI Chat message Controller

export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    const creditResult = await User.findOneAndUpdate(
       { _id: userId, credits: { $gte: 1 } },
       { $inc: { credits: -1 } }
    );
     if (!creditResult) {
            return res.json({success: false, message: "You don't have enough credits to use this feature"})
        }

    const { chatId, prompt } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });
    
    const {choices} = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "user",
          content: prompt
        },
      ],
    });

    const reply = {...choices[0].message, timestamp: Date.now(),isImage: false}
     
    res.json({success: true, reply})

    chat.messages.push(reply)
    await chat.save()
    // await User.updateOne({_id: userId}, {$inc: {credits: -1}}) // Removed, done at start

  } catch (error) {
    await User.updateOne({_id: req.user._id}, {$inc: {credits: 1}}); // Refund
    res.json({success: false, message: error.message})
  }
};


// Image Generation Message Controller

export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const creditResult = await User.findOneAndUpdate(
            { _id: userId, credits: { $gte: 2 } },
            { $inc: { credits: -2 } }
         );
    
         if (!creditResult) {
             return res.json({success: false, message: "You don't have enough credits to use this feature"})
         }

        const {prompt, chatId, isPublished} = req.body

        const chat = await Chat.findOne({userId, _id: chatId})

        chat.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false
        })

        const encodedPrompt = encodeURIComponent(prompt)

        const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;

        const aiImageResponse = await axios.get(generatedImageUrl, {responseType: "arraybuffer"})

        // Convert to Base64

        const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString('base64')}`;

        // upload to ImageKit Media Library 

        const uploadResponse = await imageKit.upload({
            file: base64Image,
            fileName: `${Date.now()}.png`,
            folder: "quickgpt"
        })

        const reply = {role: 'assistant',content: uploadResponse.url, timestamp: Date.now(),isImage: true, isPublished}
        res.json({success: true, reply})

        chat.messages.push(reply)
        await chat.save()
        // await User.updateOne({_id: userId}, {$inc: {credits: -2}}) // Removed, done at start


    } catch (error) {
        await User.updateOne({_id: req.user._id}, {$inc: {credits: 2}}); // Refund
        res.json({success: false, message: error.message})
    }
}
