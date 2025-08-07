

const TextReviewCard = ({content,author,rating,createdAt}) => {
  return (
    <div className="bg-blue-300 rounded shadow p-4 grid grid-cols-1 gap-1">
    <p className='text-2xl'>{content}</p>
    <div className="mt-2">
      <p className="font-semibold">{author} ★★★★★ {rating}</p>
      <p className="text-sm text-gray-500">{new Date(createdAt).toLocaleDateString()}</p>
    </div>
  </div>
  )
}

export default TextReviewCard