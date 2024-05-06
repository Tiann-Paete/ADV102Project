import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { HiUserCircle } from 'react-icons/hi';
import { BiSolidBook } from "react-icons/bi";
import { getFirestore, collection, addDoc, updateDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import app from "../Firebase/firebaseConfig"; 
import { useForm, SubmitHandler } from 'react-hook-form'; 
import Swal from 'sweetalert2';

interface IFormInput {
  section: string;
  title: string;
  genre: string;
  date: string;
}

const Home = () => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit, reset } = useForm<IFormInput>(); // Initialize React Hook Form
  const [books, setBooks] = useState<any[]>([]); // State to hold books data

  useEffect(() => {
    fetchBooks(); // Fetch books data on component mount
  }, []);

  const fetchBooks = async () => {
    const db = getFirestore(app); // Initialize Firestore
    const booksCollection = collection(db, 'Books Borrowed');
    const querySnapshot = await getDocs(booksCollection);
    const bookData: any[] = [];
    querySnapshot.forEach((doc) => {
      bookData.push({ id: doc.id, ...doc.data() });
    });
    setBooks(bookData);
  };

  const handleLogout = () => {
    router.push('/');
  };

  const onSubmit: SubmitHandler<IFormInput> = async (formData) => {
    const db = getFirestore(app); // Initialize Firestore
    try {
      // Add user data to Firestore
      const docRef = await addDoc(collection(db, 'Books Borrowed'), formData);
      console.log('User added to Firestore with ID: ', docRef.id);
      // Close the modal and reset the form
      setShowModal(false);
      reset({
        section: '',
        title: '',
        genre: '',
        date: '',
      });
      // Fetch updated books data
      fetchBooks();
    } catch (error) {
      console.error('Error adding user to Firestore: ', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const handleCancel = () => {
    // Close the modal and reset the form
    setShowModal(false);
    reset({
      section: '',
      title: '',
      genre: '',
      date: '',
    });
  };

  const handleEdit = async (id: string) => {
    const selected = books.find(book => book.id === id);
    const { value: section, dismiss: cancelEdit } = await Swal.fire({
      title: "Edit Section",
      input: "text",
      inputLabel: "Section",
      inputValue: selected?.section,
      inputPlaceholder: "Enter the updated section",
      showCancelButton: true,
      confirmButtonText: "Save",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      allowEscapeKey: false,
      allowOutsideClick: false,
      inputValidator: (value) => {
        if (!value) {
          return "Please enter the updated section.";
        }
        return null;
      }
    });
  
    if (section && !cancelEdit) {
      const { value: title, dismiss: cancelTitleEdit } = await Swal.fire({
        title: "Edit Title",
        input: "text",
        inputLabel: "Title",
        inputValue: selected?.title,
        inputPlaceholder: "Enter the updated title",
        showCancelButton: true,
        confirmButtonText: "Save",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      });
      const { value: genre, dismiss: cancelGenreEdit } = await Swal.fire({
        title: "Edit Genre",
        input: "text",
        inputLabel: "Genre",
        inputValue: selected?.genre,
        inputPlaceholder: "Enter the updated genre",
        showCancelButton: true,
        confirmButtonText: "Save",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      });
      const { value: date, dismiss: cancelDateEdit } = await Swal.fire({
        title: "Edit Date",
        input: "date",
        inputLabel: "Date",
        inputValue: selected?.date,
        inputPlaceholder: "Select the updated date",
        showCancelButton: true,
        confirmButtonText: "Save",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      });
  
      if (title && genre && date && !cancelTitleEdit && !cancelGenreEdit && !cancelDateEdit) {
        // Update the book in Firestore with the new values
        const db = getFirestore(app);
        try {
          await updateDoc(doc(db, 'Books Borrowed', id), {
            section,
            title,
            genre,
            date,
          });
          Swal.fire("Book updated successfully!", "", "success");
          fetchBooks(); // Fetch updated books data
        } catch (error) {
          console.error('Error updating book:', error);
          Swal.fire("Error updating book", (error as Error).message, "error");
          // Handle error (e.g., show an error message to the user)
        }
      } else {
        Swal.fire("Edit cancelled.", "", "info");
      }
    } else if (cancelEdit) {
      Swal.fire("Edit cancelled.", "", "info");
    }
  };  
  
  const handleCheck = async (id: string) => {
    // Show a confirmation message using SweetAlert
    const confirmResult = await Swal.fire({
      title: 'Confirm',
      text: 'Is your Book done used?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });
  
    // Check if the user confirmed the action
    if (confirmResult.isConfirmed) {
      // Implement delete logic here, e.g., delete the book from Firestore
      const db = getFirestore(app);
      try {
        await deleteDoc(doc(db, 'Books Borrowed', id));
        console.log('Book deleted successfully.');
        fetchBooks(); // Fetch updated books data
        // Show success message
        Swal.fire('Deleted!', 'Your book has been removed.', 'success');
      } catch (error) {
        console.error('Error deleting book:', error);
        // Handle error (e.g., show an error message to the user)
        Swal.fire('Error', 'An error occurred while deleting the book.', 'error');
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-t from-zinc-50 via-sky-700 to-indigo-900">
      <header className="bg-blue-900 text-white py-4 px-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-semibold mb-1 ml-3 mt-2">Welcome Student</h1>
          <p className="text-lg ml-3">
          Please input your borrowed books details below. Happy reading!😊
          </p>
        </div>
        <div className="relative mr-12">
          <HiUserCircle
            size={34}
            className="cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg">
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-300"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      <div className="flex justify-end px-8 mt-10 mr-10">
      <button
        className="bg-green-500 hover:bg-green-600 text-lg text-white px-4 py-2 rounded-lg flex items-center mb-2 "
        onClick={() => setShowModal(true)}>
        <BiSolidBook className="mr-2" />
        Add Book
      </button>
      </div>
      <div className="overflow-x-auto shadow-md sm:rounded-lg mx-16 mt-4">
        <table className="w-full table-auto text-sm text-center text-gray-500 dark:text-gray-400">
          <thead className="text-lg bg-gray-300 border border-gray-500 text-gray-600 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
            <th scope="col" className=""> 
                Section
              </th>
              <th scope="col" className="px-4 py-3"> 
                Title
              </th>
              <th scope="col" className="px-4 py-3"> 
                Genre
              </th>
              <th scope="col" className=""> 
                Date
              </th>
              <th scope="col" className=""> 
              </th>
            </tr>
          </thead>
          <tbody className="bg-white text-base text-center">
          {books.map((book) => (
    <tr key={book.id}>
      <td className="px-6 py-4 hover:bg-sky-200">{book.section}</td>
      <td className="px-6 py-4 hover:bg-sky-200">{book.title}</td>
      <td className="px-6 py-4 hover:bg-sky-200">{book.genre}</td>
      <td className="hover:bg-sky-200">{book.date}</td>
      <td>
      <button
          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg mr-3"
        >
          Comment
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-lg mr-3"
          onClick={() => handleEdit(book.id)}
        >
          Edit
        </button>
        
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-lg"
          onClick={() => handleCheck(book.id)}
        >
          Submit
        </button>
      </td>
    </tr>
  ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
          <div className="bg-white rounded-lg p-8 w-96">
            <h2 className="text-2xl font-semibold mb-4">Add User</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-6">
                <label htmlFor="section" className="block text-sm font-medium text-gray-700">
                  Section
                </label>
                <input
                  type="text"
                  id="section"
                  className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm focus:ring-sky-800 sm:text-sm h-10 focus:ring focus:ring-sky-300 focus:ring-opacity-75 focus:outline-none"
                  {...register('section', { required: true })}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm focus:ring-sky-800 focus:border-sky-300 sm:text-sm h-10 focus:ring focus:ring-sky-300 focus:ring-opacity-75 focus:outline-none"
                  {...register('title', { required: true })}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
                  Genre
                </label>
                <input
                  type="text"
                  id="genre"
                  className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm focus:ring-sky-800 focus:border-sky-300 sm:text-sm h-10 focus:ring focus:ring-sky-300 focus:ring-opacity-75 focus:outline-none"
                  {...register('genre', { required: true })}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm focus:ring-sky-800 focus:border-sky-300 sm:text-sm h-10 focus:ring focus:ring-sky-300 focus:ring-opacity-75 focus:outline-none"
                  {...register('date', { required: true })}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg mr-4"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
