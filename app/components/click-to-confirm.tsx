export default function() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  return <button className={`btn btn-block ${confirmDelete ? 'btn-error' : 'btn-ghost'}`} onClick={() => setConfirmDelete(true)} type={confirmDelete ? 'submit' : 'button'}>
                  {confirmDelete ? 'Click to confirm' : 'Delete this form'}
                </button>
}