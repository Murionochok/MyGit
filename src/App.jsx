import React, { useState } from "react";
import {
  FileCode,
  ArrowLeft,
  ArrowRight,
  RefreshCcw,
  Save,
} from "lucide-react";
import "./App.css";

// Клас вузла для двозв'язного списку версій коду
class CodeVersionNode {
  constructor(code, language, description) {
    this.code = code;
    this.language = language;
    this.description = description;
    this.timestamp = new Date().toLocaleString();
    this.prev = null;
    this.next = null;
  }
}

const CodeNavigator = () => {
  // Початкові версії коду
  const [versions, setVersions] = useState([
    new CodeVersionNode(
      `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)`,
      "python",
      "Перша версія: рекурсивна реалізація"
    ),
  ]);

  // Стан для поточної версії коду
  const [currentNode, setCurrentNode] = useState(versions[0]);

  // Стан для введення коду
  const [inputCode, setInputCode] = useState(currentNode.code);
  const [inputLanguage, setInputLanguage] = useState(currentNode.language);
  const [inputDescription, setInputDescription] = useState("");

  // Навігація назад
  const goToPreviousVersion = () => {
    if (currentNode.prev) {
      setCurrentNode(currentNode.prev);
      setInputCode(currentNode.prev.code);
      setInputLanguage(currentNode.prev.language);
    }
  };

  // Навігація вперед
  const goToNextVersion = () => {
    if (currentNode.next) {
      setCurrentNode(currentNode.next);
      setInputCode(currentNode.next.code);
      setInputLanguage(currentNode.next.language);
    }
  };

  // Збереження нової версії
  const saveNewVersion = () => {
    const newNode = new CodeVersionNode(
      inputCode,
      inputLanguage,
      inputDescription || `Версія від ${new Date().toLocaleString()}`
    );

    // Встановлення зв'язків
    newNode.prev = currentNode;
    currentNode.next = newNode;

    // Оновлення масиву версій
    const updatedVersions = [...versions, newNode];
    setVersions(updatedVersions);

    // Перехід до нової версії
    setCurrentNode(newNode);

    // Скидання опису
    setInputDescription("");
  };

  // Скидання до першої версії
  const resetToFirstVersion = () => {
    const firstVersion = versions[0];
    setCurrentNode(firstVersion);
    setInputCode(firstVersion.code);
    setInputLanguage(firstVersion.language);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-xl p-6 w-full max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <FileCode className="mr-3 text-indigo-600" />
            Навігатор Версій Коду
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Поточна версія */}
          <div>
            <div className="bg-gray-900 text-white rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">
                  {currentNode.description}
                </span>
                <span className="text-sm text-gray-500">
                  {currentNode.timestamp}
                </span>
              </div>
              <pre className="overflow-x-auto text-sm">
                <code>{currentNode.code}</code>
              </pre>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={goToPreviousVersion}
                disabled={!currentNode.prev}
                className="
                  flex items-center px-4 py-2 bg-indigo-500 text-white rounded
                  disabled:opacity-50 disabled:cursor-not-allowed
                  hover:bg-indigo-600 transition-colors
                "
              >
                <ArrowLeft className="mr-2" /> Попередня
              </button>

              <button
                onClick={resetToFirstVersion}
                className="
                  flex items-center px-4 py-2 bg-gray-500 text-white rounded
                  hover:bg-gray-600 transition-colors
                "
              >
                <RefreshCcw className="mr-2" /> Скинути
              </button>

              <button
                onClick={goToNextVersion}
                disabled={!currentNode.next}
                className="
                  flex items-center px-4 py-2 bg-indigo-500 text-white rounded
                  disabled:opacity-50 disabled:cursor-not-allowed
                  hover:bg-indigo-600 transition-colors
                "
              >
                Наступна <ArrowRight className="ml-2" />
              </button>
            </div>
          </div>

          {/* Форма введення */}
          <div>
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Створити нову версію
              </h2>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Мова:</label>
                <select
                  value={inputLanguage}
                  onChange={(e) => setInputLanguage(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Код:</label>
                <textarea
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  rows="10"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Введіть код..."
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Опис зміни (опційно):
                </label>
                <input
                  type="text"
                  value={inputDescription}
                  onChange={(e) => setInputDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Коротко опишіть зміни"
                />
              </div>

              <button
                onClick={saveNewVersion}
                className="
                  w-full flex items-center justify-center 
                  px-4 py-2 bg-green-500 text-white rounded
                  hover:bg-green-600 transition-colors
                "
              >
                <Save className="mr-2" /> Зберегти версію
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeNavigator;
