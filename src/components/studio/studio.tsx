'use client';

import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { Check } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePersistedSetup } from '@/hooks/use-persisted-setup';
import { findProduct, type Category, type Product, type ProductId } from '@/lib/catalog';
import { quote } from '@/lib/pricing';
import { applyPreset, surpriseSetup, type Preset } from '@/lib/presets';
import { chooseProduct, initialSetup, lineItems, setQuantity } from '@/lib/setup';
import CheckoutContent from '@/components/dialogs/checkout-content';
import HelpContent from '@/components/dialogs/help-content';
import Modal from '@/components/dialogs/modal';
import type { SceneHandle } from '@/components/scene/workspace-scene';
import CatalogPanel from './catalog-panel';
import Header from './header';
import Intro from './intro';
import { ClosingNote, PageFooter, TrustRow } from './page-footer';
import PresetBar from './preset-bar';
import PreviewPanel from './preview-panel';
import RentalBar from './rental-bar';
import styles from './studio.module.css';

const TOAST_DURATION_MS = 2600;
const HIGHLIGHT_DURATION_MS = 1600;
/** Long enough for removed items to finish animating out of the room. */
const SNAPSHOT_SETTLE_MS = 900;

type OpenModal = 'checkout' | 'help' | null;

export default function Studio() {
  const [setup, setSetup] = usePersistedSetup();
  const [category, setCategory] = useState<Category>('desks');
  const [highlightedId, setHighlightedId] = useState<ProductId | null>(null);
  const [openModal, setOpenModal] = useState<OpenModal>(null);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [cameraResetKey, setCameraResetKey] = useState(0);
  const [toast, setToast] = useState('');
  const sceneRef = useRef<SceneHandle>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!highlightedId) return;
    const timer = setTimeout(() => setHighlightedId(null), HIGHLIGHT_DURATION_MS);
    return () => clearTimeout(timer);
  }, [highlightedId]);

  // Keep the checkout picture truthful when items are removed from inside the dialog.
  useEffect(() => {
    if (openModal !== 'checkout') return;
    const timer = setTimeout(
      () => setSnapshot(sceneRef.current?.takeSnapshot() ?? null),
      SNAPSHOT_SETTLE_MS,
    );
    return () => clearTimeout(timer);
  }, [setup, openModal]);

  const closeModal = () => setOpenModal(null);
  const resetCamera = () => setCameraResetKey((key) => key + 1);

  const choose = (product: Product) =>
    setSetup((current) => chooseProduct(current, product));
  const changeQuantity = (product: Product, quantity: number) =>
    setSetup((current) => setQuantity(current, product, quantity));

  /** Clicking a model in the 3D room jumps to that product in the catalog. */
  const showInCatalog = useCallback((id: ProductId) => {
    const product = findProduct(id);
    if (!product) return;
    setCategory(product.category);
    setHighlightedId(id);
  }, []);

  function startFromPreset(preset: Preset) {
    setSetup((current) => applyPreset(current, preset));
  }

  function surpriseMe() {
    setSetup((current) => surpriseSetup(current));
  }

  function startFresh() {
    setSetup(initialSetup);
    resetCamera();
    setToast('A fresh start. Your setup has been reset.');
  }

  function openCheckout() {
    setSnapshot(sceneRef.current?.takeSnapshot() ?? null);
    setOpenModal('checkout');
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="app" data-theme={setup.theme}>
        <Header onOpenHelp={() => setOpenModal('help')} />

        <main>
          <Intro />
          <section className={styles.builder} aria-label="Workspace builder">
            <PresetBar setup={setup} onPreset={startFromPreset} onSurprise={surpriseMe} />
            <div className={styles.workspace}>
              <CatalogPanel
                setup={setup}
                category={category}
                highlightedId={highlightedId}
                onCategoryChange={setCategory}
                onChoose={choose}
                onQuantityChange={changeQuantity}
              />
              <PreviewPanel
                setup={setup}
                sceneRef={sceneRef}
                cameraResetKey={cameraResetKey}
                onResetCamera={resetCamera}
                onThemeChange={(theme) => setSetup((current) => ({ ...current, theme }))}
                onTimeChange={(timeOfDay) =>
                  setSetup((current) => ({ ...current, timeOfDay }))
                }
                onPick={showInCatalog}
              />
            </div>
          </section>
          <RentalBar
            weeks={setup.weeks}
            pricing={quote(setup)}
            itemCount={lineItems(setup).reduce((sum, { quantity }) => sum + quantity, 0)}
            onWeeksChange={(weeks) => setSetup((current) => ({ ...current, weeks }))}
            onRent={openCheckout}
          />
          <TrustRow onStartFresh={startFresh} />
          <ClosingNote />
        </main>

        <PageFooter />

        <AnimatePresence>
          {toast && (
            <motion.div
              className={styles.toast}
              role="status"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Check size={16} />
              {toast}
            </motion.div>
          )}
        </AnimatePresence>

        <Modal isOpen={openModal !== null} onClose={closeModal}>
          {openModal === 'help' && <HelpContent onClose={closeModal} />}
          {openModal === 'checkout' && (
            <CheckoutContent
              setup={setup}
              snapshot={snapshot}
              onQuantityChange={changeQuantity}
              onRemove={choose}
              onClose={closeModal}
            />
          )}
        </Modal>
      </div>
    </MotionConfig>
  );
}
