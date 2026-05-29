-- Mise à jour des valeurs de statut_validation en anglais
ALTER TABLE public.salons DROP CONSTRAINT salons_statut_validation_check;

ALTER TABLE public.salons
  ADD CONSTRAINT salons_statut_validation_check
  CHECK (statut_validation IN ('waiting', 'approved', 'rejected'));

ALTER TABLE public.salons
  ALTER COLUMN statut_validation SET DEFAULT 'waiting';
