diff --git a/src/main.jsx b/src/main.jsx
--- a/src/main.jsx
+++ b/src/main.jsx
@@ -0,0 +1,9 @@
+import React from 'react';
+import ReactDOM from 'react-dom/client';
+import BonnieChat from './BonnieChat_Fixed.jsx';
+
+ReactDOM.createRoot(document.getElementById('root')).render(
+  <React.StrictMode>
+    <BonnieChat />
+  </React.StrictMode>
+);