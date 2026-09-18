// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use tauri::{Manager, WindowEvent};
use tauri_plugin_global_shortcut::{
    Code,
    GlobalShortcutExt,
    Modifiers,
    Shortcut,
    ShortcutState,
};

mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .manage(commands::ScreenPickerCaptureState::default())
        .invoke_handler(tauri::generate_handler![
            commands::open_screen_picker,
            commands::close_screen_picker,
            commands::complete_screen_pick,
            commands::preview_screen_picker_color
        ])
        .setup(|app| {
            let shortcut = Shortcut::new(
                Some(Modifiers::CONTROL | Modifiers::SHIFT),
                Code::KeyC,
            );

            app.global_shortcut().on_shortcut(
                shortcut,
                |app, _, event| {
                    if event.state() == ShortcutState::Pressed {
                        if let Err(error) = commands::show_screen_picker(app) {
                            eprintln!("Failed to open screen picker: {error}");
                        }
                    }
                },
            )?;

            Ok(())
        })
        .on_window_event(|window, event| {
            if window.label() != "main" {
                return;
            }

            if let WindowEvent::CloseRequested { .. } = event {
                window.app_handle().exit(0);
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
