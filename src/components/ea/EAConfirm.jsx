// src/components/ui/custom/EAConfirm.jsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function EAConfirm({
  open,
  onOpenChange,
  onConfirm,
  title = "Você tem certeza?",
  description = "Essa ação não pode ser desfeita.",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white rounded-3xl w-[90%] border-none">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-slate-800">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row gap-2 mt-4">
          <AlertDialogCancel className="flex-1 rounded-xl border-slate-200">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-600 hover:bg-red-700"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
