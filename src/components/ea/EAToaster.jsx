import { Toaster } from "@/components/ui/sonner";

export default function EAToaster() {
  return (
    <AuthProvider>
      <Router>{/* ... suas rotas ... */}</Router>
      <Toaster position="bottom-center" richColors />
    </AuthProvider>
  );
}
