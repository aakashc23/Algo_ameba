import { createRoot } from 'react-dom/client';
import './index.css';
import 'sonner/dist/styles.css';
import { ThemeProvider } from '@/components/ui/theme-provider.tsx';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import SortPage from '@/components/sort/SortPage.tsx';
import SearchPage from '@/components/search/SearchPage.tsx';
import QueuePage from '@/components/queue/queuePage.tsx';
import StackPage from '@/components/stack/stackPage.tsx';
import { Toaster } from '@/components/ui/sonner.tsx';
import LinkedListPage from '@/components/linkedlist/llPage.tsx';
import GraphPage from '@/components/graph/GraphPage.tsx';
import HeapPage from '@/components/heap/HeapPage.tsx';
import TreePage from '@/components/tree/TreePage.tsx';
import Homepage from '@/pages/Homepage.tsx';
import LandingPage from '@/pages/LandingPage.tsx';
import AboutPage from '@/pages/AboutPage.tsx';
import { ROUTES } from '@/constants/routes';
import { PageTransition } from '@/components/PageTransition';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <BrowserRouter>
      <Routes>
        <Route
          path={ROUTES.landing}
          element={
            <PageTransition>
              <LandingPage />
            </PageTransition>
          }
        />
        <Route
          path={ROUTES.home}
          element={
            <PageTransition>
              <Homepage />
            </PageTransition>
          }
        />
        <Route
          path={ROUTES.algorithms}
          element={
            <PageTransition>
              <Homepage />
            </PageTransition>
          }
        />
        <Route
          path={ROUTES.about}
          element={
            <PageTransition>
              <AboutPage />
            </PageTransition>
          }
        />
        <Route
          path={ROUTES.sort}
          element={
            <PageTransition>
              <SortPage />
            </PageTransition>
          }
        />
        <Route
          path={ROUTES.search}
          element={
            <PageTransition>
              <SearchPage />
            </PageTransition>
          }
        />
        <Route
          path={ROUTES.queue}
          element={
            <PageTransition>
              <QueuePage />
            </PageTransition>
          }
        />
        <Route
          path={ROUTES.stack}
          element={
            <PageTransition>
              <StackPage />
            </PageTransition>
          }
        />
        <Route
          path={ROUTES.linkedlist}
          element={
            <PageTransition>
              <LinkedListPage />
            </PageTransition>
          }
        />
        <Route
          path={ROUTES.graph}
          element={
            <PageTransition>
              <GraphPage />
            </PageTransition>
          }
        />
        <Route
          path={ROUTES.tree}
          element={
            <PageTransition>
              <TreePage />
            </PageTransition>
          }
        />
        <Route
          path={ROUTES.heap}
          element={
            <PageTransition>
              <HeapPage />
            </PageTransition>
          }
        />

        <Route path="*" element={<Navigate to={ROUTES.landing} replace />} />
      </Routes>
    </BrowserRouter>
    <Toaster />
  </ThemeProvider>
);
