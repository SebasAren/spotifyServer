import dbus

class MPRISRemote():
    
    def __init__(self):
        self.dbus = dbus.SessionBus()
        root_obj = self.dbus.get_object('org.mpris.clementine', '/')
        player_obj = self.dbus.get_object('org.mpris.clementine', '/Player')
        tracklist_obj = self.dbus.get_object('org.mpris.clementine', '/TrackList')

        self.root = dbus.Interface(root_obj, dbus_interface='org.freedesktop.MediaPlayer')
        self.player = dbus.Interface(player_obj, dbus_interface='org.freedesktop.MediaPlayer')
        self.tracklist = dbus.Interface(tracklist_obj, dbus_interface='org.freedesktop.MediaPlayer')

    def play_song(self):
        self.player.Play()

    def add_spotify_song(self, uri):
        self.tracklist.AddTrack(uri, False)

mpris_remote = MPRISRemote()
mpris_remote.add_spotify_song()
