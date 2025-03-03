"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useState, useEffect, useRef } from "react";
import { Extension, Editor, Range } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import ReactDOM from "react-dom/client";
import { EditorView } from "prosemirror-view";

// EditorView 타입 확장
declare module "prosemirror-view" {
  interface EditorView {
    editorInstance?: Editor;
  }
}

// 슬래시 메뉴 컴포넌트 (화살표 키 지원 추가)
const SlashMenuList = ({
  items,
  command,
  selectedIndex = 0,
}: {
  items: any[];
  command: any;
  selectedIndex?: number;
}) => {
  return (
    <div className="slash-menu">
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => command(item)}
          className={`
            slash-menu-item ${index === selectedIndex ? "selected" : ""}`}
        >
          {item.icon && <span className="menu-item-icon">{item.icon}</span>}
          {item.description && (
            <span className="menu-item-description">{item.description}</span>
          )}
        </button>
      ))}
    </div>
  );
};

// 슬래시 명령어 확장 생성
const SlashCommands = Extension.create({
  name: "slashCommands",

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: "/",
        allowSpaces: false, // 공백 허용 여부
        allowedPrefixes: [" ", "\n"], // 슬래시 앞에 허용되는 문자
        startOfLine: false, // 라인 시작에서만 동작하는지 여부
        decorationTag: "span", // 슬래시 메뉴 활성화 시 사용할 HTML 태그
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          props: any;
        }) => {
          props.command({ editor, range });
        },
        items: ({ query }: { query: string }) => {
          const items = [
            {
              title: "제목 1",
              icon: "H1",
              description: "큰 제목",
              command: ({
                editor,
                range,
              }: {
                editor: Editor;
                range: Range;
              }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setNode("heading", { level: 1 })
                  .run();
              },
            },
            {
              title: "제목 2",
              icon: "H2",
              description: "중간 제목",
              command: ({
                editor,
                range,
              }: {
                editor: Editor;
                range: Range;
              }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setNode("heading", { level: 2 })
                  .run();
              },
            },
            {
              title: "제목 3",
              icon: "H3",
              description: "작은 제목",
              command: ({
                editor,
                range,
              }: {
                editor: Editor;
                range: Range;
              }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setNode("heading", { level: 3 })
                  .run();
              },
            },
            {
              title: "글머리 기호 목록",
              icon: "•",
              description: "글머리 기호가 있는 목록",
              command: ({
                editor,
                range,
              }: {
                editor: Editor;
                range: Range;
              }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleBulletList()
                  .run();
              },
            },
            {
              title: "번호 매기기 목록",
              icon: "1.",
              description: "번호가 매겨진 목록",
              command: ({
                editor,
                range,
              }: {
                editor: Editor;
                range: Range;
              }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleOrderedList()
                  .run();
              },
            },
            {
              title: "인용구",
              icon: "❝",
              description: "인용문 블록 생성",
              command: ({
                editor,
                range,
              }: {
                editor: Editor;
                range: Range;
              }) => {
                editor.chain().focus().deleteRange(range).setBlockquote().run();
              },
            },
            {
              title: "코드 블록",
              icon: "</>",
              description: "코드 블록 생성",
              command: ({
                editor,
                range,
              }: {
                editor: Editor;
                range: Range;
              }) => {
                editor.chain().focus().deleteRange(range).setCodeBlock().run();
              },
            },
            {
              title: "수평선",
              icon: "―",
              description: "수평선 삽입",
              command: ({
                editor,
                range,
              }: {
                editor: Editor;
                range: Range;
              }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setHorizontalRule()
                  .run();
              },
            },
            {
              title: "텍스트",
              icon: "¶",
              description: "일반 텍스트 단락",
              command: ({
                editor,
                range,
              }: {
                editor: Editor;
                range: Range;
              }) => {
                editor.chain().focus().deleteRange(range).setParagraph().run();
              },
            },
          ];

          return items.filter(
            (item) =>
              item.title.toLowerCase().includes(query.toLowerCase()) ||
              (item.description &&
                item.description.toLowerCase().includes(query.toLowerCase()))
          );
        },
        // Suggestion render 부분 수정

        render: () => {
          let component: any;
          let popup: any;
          let selectedIndex = 0;
          let currentItems: any[] = [];
          let currentProps: any = null; // 현재 props 저장

          const renderItems = () => {
            if (!currentItems || !currentItems.length || !currentProps) return;

            component.innerHTML = "";
            ReactDOM.createRoot(component).render(
              <SlashMenuList
                items={currentItems}
                command={(item: any) => {
                  if (popup && popup[0]) {
                    popup[0].hide();
                  }

                  // 반드시 현재 에디터 인스턴스 전달
                  item.command({
                    editor: currentProps.editor,
                    range: currentProps.range,
                  });
                }}
                selectedIndex={selectedIndex}
              />
            );

            // 선택된 항목이 보이도록 스크롤 조정
            setTimeout(() => {
              const selectedElement = component.querySelector(".selected");
              if (selectedElement) {
                selectedElement.scrollIntoView({ block: "nearest" });
              }
            }, 0);
          };

          return {
            onStart: (props: any) => {
              component = document.createElement("div");
              component.className = "slash-menu-container";
              selectedIndex = 0;

              // props와 아이템 목록 저장
              currentProps = props;
              currentItems = props.items || [];
              console.log("onStart props:", props);

              popup = tippy("body", {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
                zIndex: 9999,
              });

              renderItems();
            },

            onUpdate: (props: any) => {
              // props와 아이템 목록 업데이트
              currentProps = props;
              currentItems = props.items || [];
              console.log("onUpdate props:", props);

              if (popup && popup[0]) {
                popup[0].setProps({
                  getReferenceClientRect: props.clientRect,
                });
              }

              renderItems();
            },

            // onKeyDown 함수 수정

            onKeyDown: (props: any) => {
              const { event } = props;

              // 현재 props 저장
              currentProps = props;

              console.log("onKeyDown:", {
                key: event.key,
                items: currentItems.length,
                editor: currentProps.editor ? "있음" : "없음",
                range: currentProps.range ? "있음" : "없음",
              });

              // 항목이 없을 경우 처리 방지
              if (!currentItems || !currentItems.length) {
                return false;
              }

              // Escape 키 처리
              if (event.key === "Escape") {
                popup[0].hide();
                return true; // 이벤트 처리됨을 반환
              }

              if (event.key === "ArrowDown") {
                event.preventDefault(); // 중요: 기본 동작 방지
                selectedIndex = (selectedIndex + 1) % currentItems.length;
                renderItems();
                return true;
              }

              if (event.key === "ArrowUp") {
                event.preventDefault(); // 중요: 기본 동작 방지
                selectedIndex =
                  (selectedIndex + currentItems.length - 1) %
                  currentItems.length;
                renderItems();
                return true;
              }

              // Enter 키와 Tab 키 처리
              if (event.key === "Enter" || event.key === "Tab") {
                // 가장 중요: 기본 동작 막기
                event.preventDefault();
                event.stopPropagation();

                const item = currentItems[selectedIndex];
                console.log("Enter/Tab pressed, selected item:", item);

                if (item) {
                  if (popup && popup[0]) {
                    popup[0].hide();
                  }

                  // 현재 저장된 에디터와 범위 정보 사용
                  try {
                    console.log("Execute command with:", {
                      editor: !!currentProps.editor,
                      range: !!currentProps.range,
                    });

                    const editorInstance =
                      props.editor || this.editor || props.view?.editorInstance;

                    item.command({
                      editor: editorInstance,
                      range: currentProps.range,
                    });
                  } catch (error) {
                    console.error("Command execution error:", error);
                  }

                  return true; // 이벤트 처리됨을 반환
                }
              }

              return false;
            },

            onExit: () => {
              if (popup && popup[0]) {
                popup[0].destroy();
              }
              if (component) {
                component.remove();
              }

              // 메모리 정리
              component = null;
              popup = null;
              currentItems = [];
              currentProps = null;
            },
          };
        },
      }),
    ];
  },
});

interface TiptapEditorProps {
  content: string | undefined;
  onChange: (content: string) => void;
}

const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  // editorRef를 생성하여 에디터 인스턴스를 저장
  const editorRef = useRef<Editor | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      SlashCommands.configure({
        // 어떤 설정이든 필요하다면 추가
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onBeforeCreate({ editor }) {
      // 에디터 인스턴스 저장
      editorRef.current = editor;
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none",
      },
      // 중요: 에디터의 키 이벤트 핸들러는 제거
      // handleKeyDown을 제거하거나 다음과 같이 수정
      handleKeyDown: (view, event) => {
        // 슬래시 메뉴가 열려 있는 경우만 특별히 처리
        // 나머지는 기본 동작 유지
        return false;
      },
    },
    // 에디터가 마운트될 때 포커스 설정
    autofocus: true,
  });

  // useEffect에서 SlashCommands 확장에 에디터 인스턴스 전달
  useEffect(() => {
    if (editor && editorRef.current) {
      // ProseMirror 뷰에 에디터 인스턴스 추가
      const view = editor.view;
      if (view) {
        view.editorInstance = editorRef.current;
      }
    }
  }, [editor]);

  // useEffect를 추가하여 외부에서 content가 변경되면 에디터 내용도 업데이트
  useEffect(() => {
    if (editor && content !== undefined && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="editor-container w-full">
      <EditorContent
        editor={editor}
        className="w-full h-[60vh] prose max-w-none prose-sm lg:prose-lg xl:prose-xl text-white prose-strong:text-white bg-zinc-800 rounded-md p-2 overflow-y-scroll prose-li:marker:text-white prose-p:my-2 prose:headings:mt-0 prose:headings:mb-3"
        placeholder="내용을 입력하세요."
        width="100%"
      />
      <style jsx global>{`
        .slash-menu-container {
          background-color: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          overflow-y: auto;
          max-height: 300px; /* 최대 높이 설정 */
          min-width: 200px;
        }

        .slash-menu {
          width: 100%;
        }

        .slash-menu-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          width: 100%;
          padding: 8px 10px;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          color: black;
          position: relative;
        }

        .slash-menu-item.selected {
          background-color: #edf2f7;
        }

        .slash-menu-item:hover {
          background-color: #f5f5f5;
        }

        .menu-item-icon {
          display: inline-block;
          margin-right: 8px;
          font-weight: bold;
          width: 1.5rem;
          text-align: center;
        }

        .menu-item-description {
          font-size: 0.8rem;
          color: #666;
          margin-left: 8px;
        }
      `}</style>
    </div>
  );
};

export default TiptapEditor;
