-- Activation RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salons ENABLE ROW LEVEL SECURITY;

-- Policies : users
CREATE POLICY "Read own user"
ON public.users FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Policies : salons
CREATE POLICY "Insert own salon"
ON public.salons FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Select own salon"
ON public.salons FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Update own salon"
ON public.salons FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Policies : Storage justificatifs
CREATE POLICY "Upload justificatif à l'inscription"
ON storage.objects FOR INSERT
TO authenticated, anon
WITH CHECK (bucket_id = 'justificatifs');
