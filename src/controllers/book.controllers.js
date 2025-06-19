import cloudinary from '../utils/cloudinary.js';
import fs from 'fs';
import Book from '../models/book.model.js';
import Review  from '../models/review.model.js';
export const addBooks = async (req, res) =>{
    try {
        const {title, author, genre, pages, price ,description , stock } = req.body;

        if(!title || !author || !genre || !pages || !price || !description || !stock){
            return res.status(400).json({
                success : false,
                message : "Please fill all the fields"
            })
        }
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

         const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'book-covers',
            transformation: [{ width: 600, crop: 'limit' }],
        });
        

        fs.unlinkSync(req.file.path);

        const book = await Book.create({title, author, genre, pages, price ,description , stock ,addedBy : req.user._id , coverImg : {
            url : result.secure_url ,
            localPath : ''
        } });

        if(!book){
            return res.status(400).json({
                success : false,
                message : "Failed to add book"
            })
        }

        return res.status(201).json({
            success : true,
            message : "Book added successfully",
            data : book
        })
            







        
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success : false,
            message : "Error in adding book"
        })
        
    }


}

export const deleteBook = async (req, res) =>{
    try {
        const id = req.params.id;
        if(!id){
            return res.status(400).json({
                success : false,
                message : "Invalid book id"
            })

        }
        const book = await Book.findByIdAndDelete(id);

        return res.status(200).json({
            success : true,
            message : "Book deleted successfully",
        })

        
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success : false,
            message : "Error in deleting book"
        })
        
    }

}

export const updateBook = async (req, res) =>{
    try {
        const {title, author, genre, pages, price ,description , stock } = req.body;

        if(!title || !author || !genre || !pages || !price || !description || !stock){
            
            return res.status(400).json({
                success : false,
                message : "Please fill all the fields"
            })
        }
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

         const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'book-covers',
            transformation: [{ width: 600, crop: 'limit' }],
        });
        

        fs.unlinkSync(req.file.path);

       const book = await Book.findOneAndUpdate(
            { _id: req.params.id },
            {
                title,
                author,
                genre,
                pages,
                price,
                description,
                stock,
                coverImg: {
                url: result.secure_url,
                localPath: '',
                },
            },
            {
                new: true, // Return the updated document
            
            }
        );


        if(!book){
            return res.status(400).json({
                success : false,
                message : "Failed to update book"
            })
        }

        return res.status(201).json({
            success : true,
            message : "Book updated successfully",
            data : book
        })
            







        
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success : false,
            message : "Error in updating book"
        })
        
    }


}

export const getBook = async (req, res) =>{
    try {
        const id = req.params.id;

        if(!id){
            return res.status(400).json({
                success : false,
                message : "Book id is required",
            })
        }

        const book = await Book.findById(id).populate({
            path: "addedBy",
            select: "name"
        })

        if(!book){
            return res.status(404).json({
                success : false,
                message : "Book not found",
            })
        }

        return res.status(200).json({
            success : true,
            data : book
        })


        
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success : false,
            message : "Error in getting book"
        })
        
    }

}

export const getAllBooks = async (req, res) =>{
    try {
        const {genre , author, title, page, limit,sort,search} = req.query;
        let books = await Book.find().populate("addedBy","name");
        if(!books){
            return res.status(404).json({
                success : false,
                message: "Books found and filtered",
                total: books.length,
                message : "No books found",
            })
        }

        if(!genre && !author && !title && !page && !limit && !sort && !search){
            return res.status(200).json({
                success : true,
                data : books
            })
        }

        if (genre) {
            books = books.filter(book => book.genre.toLowerCase() === genre.toLowerCase());
        }

        if (author) {
             books = books.filter(book => book.author.toLowerCase() === author.toLowerCase());
        }

        if (title) {
            books = books.filter(book => book.title.toLowerCase() === title.toLowerCase());
        }


        
        if (sort) {
            if (sort === "ascGen") {
                books.sort((a, b) => a.genre.localeCompare(b.genre));
            } else if (sort === "descGen") {
                books.sort((a, b) => b.genre.localeCompare(a.genre));
            } else if (sort === "ascAuth") {
                books.sort((a, b) => a.author.localeCompare(b.author));
            } else if (sort === "descAuth") {
                books.sort((a, b) => b.author.localeCompare(a.author));
            } else if (sort === "ascTit") {
                books.sort((a, b) => a.title.localeCompare(b.title));
            } else if (sort === "descTit") {
                books.sort((a, b) => b.title.localeCompare(a.title));
            } else if (sort === "ascPri") {
                books.sort((a, b) => a.price - b.price);
            } else if (sort === "descPri") {
                books.sort((a, b) => b.price - a.price);
            }
        }

        if(search){
            books = books.filter(book => book.title.toLowerCase().includes(search.toLowerCase()));
        }

        if(page && limit){
            const startIndex = (parseInt(page) - 1) * parseInt(limit);
            const endIndex = parseInt(page) * parseInt(limit);
            books = books.slice(startIndex, endIndex);
        }
            
        

        

         return res.status(200).json({
            success: true,
            message: "Books found and filtered",
            total: books.length,
            data: books,
        });







        
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success : false,
            message : "Error in getting all books"
        })
        
    }

}
