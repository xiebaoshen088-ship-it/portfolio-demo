import { DetailDialog, EvidenceDialog } from './Dialog.jsx';

// Load the dialog code once. Opening a nested image reader must not suspend
// and hide the already open detail dialog or restart its materialization.
export default function DialogHost({ detail, shot, onCloseDetail, onCloseShot, onShot }) {
  return <>
    {detail && <DetailDialog key={detail.id} entry={detail} onClose={onCloseDetail} onShot={onShot} />}
    {shot && <EvidenceDialog key={shot.id} entry={shot} onClose={onCloseShot} />}
  </>;
}
