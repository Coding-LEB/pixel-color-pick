use screenshots::Screen;
use std::sync::Mutex;
use std::time::Duration;
use tauri::State;
use tauri::{AppHandle, Emitter, Manager};
use windows::Win32::Foundation::POINT;
use windows::Win32::UI::WindowsAndMessaging::GetCursorPos;

#[derive(Clone, serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct ColorPickedPayload {
    color: String,
    alpha: u8,
}

struct CapturedScreen {
    x: i32,
    y: i32,
    width: u32,
    height: u32,
    pixels: Vec<u8>,
}

#[derive(Default)]
pub struct ScreenPickerCaptureState {
    screens: Mutex<Vec<CapturedScreen>>,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ColorPreviewPayload {
    color: String,
    pixels: Vec<String>,
}


pub fn show_screen_picker(app: &AppHandle) -> Result<(), String> {
    let screen_picker_window = app
        .get_webview_window("screen-picker")
        .ok_or("Screen picker window was not found")?;

    if screen_picker_window
        .is_visible()
        .map_err(|error| error.to_string())?
    {
        return Ok(());
    }

    let main_window = app
        .get_webview_window("main")
        .ok_or("Main window was not found")?;

    let capture_state = app.state::<ScreenPickerCaptureState>();

    main_window.hide().map_err(|error| error.to_string())?;

    std::thread::sleep(Duration::from_millis(150));

    if let Err(error) = capture_screens(&capture_state) {
        let _ = main_window.show();
        let _ = main_window.set_focus();

        return Err(error);
    }

    screen_picker_window
        .show()
        .map_err(|error| error.to_string())?;

    screen_picker_window
        .set_focus()
        .map_err(|error| error.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn open_screen_picker(app: AppHandle) -> Result<(), String> {
    show_screen_picker(&app)
}

#[tauri::command]
pub fn close_screen_picker(app: AppHandle) -> Result<(), String> {
    let screen_picker_window = app
        .get_webview_window("screen-picker")
        .ok_or("Screen picker window was not found")?;

    let main_window = app
        .get_webview_window("main")
        .ok_or("Main window was not found")?;

    screen_picker_window
        .hide()
        .map_err(|error| error.to_string())?;

    main_window.show().map_err(|error| error.to_string())?;
    main_window.set_focus().map_err(|error| error.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn complete_screen_pick(
    app: AppHandle,
    capture_state: State<ScreenPickerCaptureState>,
) -> Result<(), String> {
    let (x, y) = get_cursor_position()?;

    let color = get_color_from_capture(&capture_state, x, y)?;

    let screen_picker_window = app
        .get_webview_window("screen-picker")
        .ok_or("Screen picker window was not found")?;

    let main_window = app
        .get_webview_window("main")
        .ok_or("Main window was not found")?;

    screen_picker_window
        .hide()
        .map_err(|error| error.to_string())?;

    main_window.show().map_err(|error| error.to_string())?;
    main_window.set_focus().map_err(|error| error.to_string())?;

    app.emit_to(
        "main",
        "color-picked",
        ColorPickedPayload { color, alpha: 100 },
    )
    .map_err(|error| error.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn preview_screen_picker_color(
    capture_state: State<ScreenPickerCaptureState>,
) -> Result<ColorPreviewPayload, String> {
    let (x, y) = get_cursor_position()?;

    get_preview_from_capture(&capture_state, x, y)
}

fn get_color_from_capture(
    capture_state: &ScreenPickerCaptureState,
    x: i32,
    y: i32,
) -> Result<String, String> {
    let screens = capture_state
        .screens
        .lock()
        .map_err(|_| "Screen capture state is unavailable".to_string())?;

    let screen = screens
        .iter()
        .find(|screen| {
            x >= screen.x
                && y >= screen.y
                && x < screen.x + screen.width as i32
                && y < screen.y + screen.height as i32
        })
        .ok_or("No captured screen was found at the cursor position")?;

    let relative_x = (x - screen.x) as u32;
    let relative_y = (y - screen.y) as u32;

    let pixel_index = ((relative_y * screen.width + relative_x) * 4) as usize;

    let red = screen.pixels[pixel_index];
    let green = screen.pixels[pixel_index + 1];
    let blue = screen.pixels[pixel_index + 2];

    Ok(format!("#{red:02X}{green:02X}{blue:02X}"))
}

fn capture_screens(capture_state: &ScreenPickerCaptureState) -> Result<(), String> {
    let screens = Screen::all().map_err(|error| format!("Could not get screens: {error}"))?;

    let mut captured_screens = Vec::new();

    for screen in screens {
        let display = screen.display_info;

        let image = screen
            .capture()
            .map_err(|error| format!("Could not capture screen: {error}"))?;

        captured_screens.push(CapturedScreen {
            x: display.x,
            y: display.y,
            width: image.width(),
            height: image.height(),
            pixels: image.into_raw(),
        });
    }

    let mut state = capture_state
        .screens
        .lock()
        .map_err(|_| "Screen capture state is unavailable".to_string())?;

    *state = captured_screens;

    Ok(())
}

fn get_cursor_position() -> Result<(i32, i32), String> {
    let mut cursor_position = POINT::default();

    unsafe {
        GetCursorPos(&mut cursor_position)
            .map_err(|error| format!("Could not get cursor position: {error}"))?;
    }

    Ok((cursor_position.x, cursor_position.y))
}

fn get_preview_from_capture(
    capture_state: &ScreenPickerCaptureState,
    x: i32,
    y: i32,
) -> Result<ColorPreviewPayload, String> {
    let screens = capture_state
        .screens
        .lock()
        .map_err(|_| "Screen capture state is unavailable".to_string())?;

    let screen = screens
        .iter()
        .find(|screen| {
            x >= screen.x
                && y >= screen.y
                && x < screen.x + screen.width as i32
                && y < screen.y + screen.height as i32
        })
        .ok_or("No captured screen was found at the cursor position")?;

    let center_x = x - screen.x;
    let center_y = y - screen.y;

    let mut pixels = Vec::with_capacity(121);

    for offset_y in -5..=5 {
        for offset_x in -5..=5 {
            let pixel_x = (center_x + offset_x).clamp(0, screen.width as i32 - 1) as u32;

            let pixel_y = (center_y + offset_y).clamp(0, screen.height as i32 - 1) as u32;

            let pixel_index = ((pixel_y * screen.width + pixel_x) * 4) as usize;

            let red = screen.pixels[pixel_index];
            let green = screen.pixels[pixel_index + 1];
            let blue = screen.pixels[pixel_index + 2];

            pixels.push(format!("#{red:02X}{green:02X}{blue:02X}"));
        }
    }

    Ok(ColorPreviewPayload {
        color: pixels[60].clone(),
        pixels,
    })
}
