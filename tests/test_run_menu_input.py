import subprocess

import run_menu


def test_read_clipboard_text_returns_pbpaste_output(monkeypatch):
    def fake_run(*args, **kwargs):
        return subprocess.CompletedProcess(args=args, returncode=0, stdout="Job text\n", stderr="")

    monkeypatch.setattr(run_menu.subprocess, "run", fake_run)

    assert run_menu._read_clipboard_text() == "Job text"


def test_read_clipboard_text_returns_empty_on_error(monkeypatch):
    def fake_run(*args, **kwargs):
        raise OSError("pbpaste unavailable")

    monkeypatch.setattr(run_menu.subprocess, "run", fake_run)

    assert run_menu._read_clipboard_text() == ""


def test_read_buffered_stdin_tail_reads_pasted_lines_until_quiet(monkeypatch):
    lines = iter(["line 2\n", "\n", "line 4\n"])
    ready = iter([True, True, True, False])

    monkeypatch.setattr(run_menu.sys.stdin, "readline", lambda: next(lines))
    monkeypatch.setattr(
        run_menu.select,
        "select",
        lambda *args, **kwargs: ([run_menu.sys.stdin], [], []) if next(ready) else ([], [], []),
    )

    assert run_menu._read_buffered_stdin_tail() == ["line 2", "", "line 4"]


def test_read_buffered_stdin_tail_stops_at_fin(monkeypatch):
    lines = iter(["line 2\n", "FIN\n", "ignored\n"])
    ready = iter([True, True, True])

    monkeypatch.setattr(run_menu.sys.stdin, "readline", lambda: next(lines))
    monkeypatch.setattr(
        run_menu.select,
        "select",
        lambda *args, **kwargs: ([run_menu.sys.stdin], [], []) if next(ready) else ([], [], []),
    )

    assert run_menu._read_buffered_stdin_tail() == ["line 2"]
